// Pierre-Antoine Desplaces, Loïc Serafin

const BASE_SIZE = 765;

let maxRadius = 0;


// "class" constructor, used to construct the circle graph
// param container: the html svg id that will contain the circle graph
// param w: width of container
// param h: height of container
function CircleGraph(container, w, h) {
    // build svg super component
    let svg = this.svg = d3.select(container)
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    // prepare nodes cluster organisation
    let cluster = this.cluster = d3.layout.cluster()
        .size([360, 240])
        .sort(function (a, b) {
            return d3.ascending(a.name, b.name);
        });

    let bundle = this.bundle = d3.layout.bundle();

    // prepare edges
    let line = this.line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(0.3)
        .radius(function (d) {
            return d.y;
        })
        .angle(function (d) {
            return d.x / 180 * Math.PI;
        });
}

// boostrap circle graph with data
// param graph: contains two objects
// 		- nodes: a list of node objects containing at least a `name` and a `weight`
//		- links: a list of link objects containing two references to nodes as `source` and `target` and a `weight`
CircleGraph.prototype.setData = function (graph) {
    let that = this;
    let nodes = that.cluster.nodes(graph.nodes[0]);
    let splines = that.bundle(graph.links);

    // draw edges
    that.link = that.svg.selectAll("path.link")
        .data(graph.links)
        .enter().append("svg:path")
        .attr("class", function (d) { // add basic html class, dependent on the source name
            return "link source-" + d.source.name + " target-" + d.target.name;
        })
        .attr("d", function (d, i) { // compute spline line
            return that.line(splines[i]);
        })
        .style("stroke-opacity", function (d) {
            return linkScale(d.weight); // display opacity depending on the weight of the edge
        })
        .style("stroke", function (d) {
            return d3.interpolatePiYG(1 - linksColorScale(d.tone_diff));
        });

    // draw sources nodes
    that.node = that.svg.selectAll("g.node")
        .data(nodes.filter(function (n) {
            return !n.children;
        }))
        .enter().append("svg:g")
        // css interaction
        .attr("class", "node")
        .attr("id", function (d) {
            return "node-" + d.key;
        })
        .attr("transform", function (d) {
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
        })
        // draw circle
        .append("svg:circle")
        .attr("r", function (d) {
            return radiusScale(d.size);
        })
        .attr("cx", function (d) {
            return maxRadius + 5;
        })
        .attr("fill", function (d) {
            return d3.interpolateRdBu(nodesColorScale(d.avg_tone));
        })
        // add interactions on circle
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted)
        .on("click", mouseclicked);

    // draw sources text names
    that.svg.selectAll("g.node")
        .append("svg:text")
        .attr("class", "node-label")
        // text position behind biggest circle
        .attr("dx", function (d) {
            let dx = 2 * maxRadius + 10;
            return d.x < 180 ? dx : -dx;
        })
        .attr("dy", ".31em")
        .attr("text-anchor", function (d) { // move out text to the exterior for the left part of the circle
            return d.x < 180 ? "start" : "end";
        })
        .attr("transform", function (d) { // turn around text on the left
            return d.x < 180 ? null : "rotate(180)";
        })
        .text(function (d) {
            return d.fullname;
        })
        // add interactions on text
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted)
        .on("click", mouseclicked);

    // mouse click interactions
    function mouseclicked(d) {
        if (hoverAble) { // if we are in overing mode
            hoverAble = false;
            sourceFocus = d.name;
        } else if (sourceFocus == d.name) { // deselect our previous source node
            hoverAble = true;
            sourceFocus = "";
        } else { // select another node
            sourceFocus = d.name;
        }

        if (!hoverAble) {
            updateToolbox(d);
            highlightNode(d);
        } else {
            updateToolbox("");
            unhighlightNode();
        }
    }

    // mouse hover interactions
    function mouseovered(d) {
        if (hoverAble) {
            updateToolbox(d);
            highlightNode(d);
        }
    }

    // reset node hovering
    function mouseouted(d) {
        if (hoverAble) {
            unhighlightNode();
        }
    }

    function highlightNode(d) {
        that.node.each(function (n) {
            n.target = n.source = false;
        });

        // change html classes for edges adjacent to selected node

        that.link.classed("link--highlighted", function (l) {
            if (l.target.name === d.name) {
                return l.source.source = true;
            } else if (l.source.name === d.name) {
                return l.target.target = true;
            } else {
                return false;
            }
        }).filter(function (l) {
            return l.target === d || l.source === d;
        }).each(function () {
            this.parentNode.appendChild(this);
        });

        that.link.classed("link--unselected", function (l) {
            return l.target.name !== d.name && l.source.name !== d.name;
        });

        that.node.classed("node--selected", function (n) {
            return n.name === d.name;
        });
        // change html classes for node selected and their neighbours
        that.node.classed("node--highlighted", function (n) {
            return n.target || n.source;
        });
    }

    function unhighlightNode() {
        updateToolbox(null);
        that.link.classed("link--highlighted", false);
        that.link.classed("link--unselected", false);
        that.node.classed("node--highlighted", false);
        that.node.classed("node--selected", false);
    }


};


