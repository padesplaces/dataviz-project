// Hierarchical bundling graph 
// Pierre-Antoine Desplaces, Loïc Serafin
// inspired by
// https://beta.observablehq.com/@mbostock/d3-hierarchical-edge-bundling

const BASE_SIZE = 765;

let maxRadius = 0;

let radiusScale = d3.scale.sqrt();
let linkScale = d3.scale.sqrt();
let nodesColorScale = d3.scale.linear();
let linksColorScale = d3.scale.linear();

let overable = true;
let sourceFocus = "";

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
	.attr("transform", "translate(" + w/2 + "," + h/2 + ")");
	
	// prepare nodes cluster organisation
	let cluster = this.cluster = d3.layout.cluster()
	.size([360, 240])
	.sort(function(a, b) {
		return d3.ascending(a.name, b.name);
	});
	
	let bundle = this.bundle = d3.layout.bundle();
	
	// prepare edges
	let line = this.line = d3.svg.line.radial()
	.interpolate("bundle")
	.tension(0.3)
	.radius(function(d) {
		return d.y;
	})
	.angle(function(d) {
		return d.x / 180 * Math.PI;
	});
}

// boostrap circle graph with data
// param graph: contains two objects
// 		- nodes: a list of node objects containing at least a `name` and a `weight`
//		- links: a list of link objects containing two references to nodes as `source` and `target` and a `weight`
CircleGraph.prototype.setData = function(graph) {
	let that = this;
	let nodes = that.cluster.nodes(graph.nodes[0]);
	let splines = that.bundle(graph.links);
	
	// draw edges
	that.link = that.svg.selectAll("path.link")
	.data(graph.links)
	.enter().append("svg:path")
	.attr("class", function(d) { // add basic html class, dependent on the source name
		return "link source-" + d.source.name + " target-" + d.target.name;
	})
	.attr("d", function(d, i) { // compute spline line
		return that.line(splines[i]);
	})
	.style("stroke-opacity", function(d) { 
		return linkScale(d.weight); // display opacity depending on the weight of the edge
	})
	.style("stroke", function(d) {
		return d3.interpolatePiYG(1-linksColorScale(d.tone_diff));
	});
	
	// draw sources nodes
	that.node = that.svg.selectAll("g.node")
	.data(nodes.filter(function(n) {
		return !n.children;
	}))
	.enter().append("svg:g")
	// css interaction
	.attr("class", "node")
	.attr("id", function(d) {
		return "node-" + d.key;
	})
	.attr("transform", function(d) {
		return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
	})
	// draw circle
	.append("svg:circle") 
	.attr("r", function(d) {
		return radiusScale(d.size);
	})
	.attr("cx", function(d) {
		return maxRadius + 5;
	})
	.attr("fill", function(d) {
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
	.attr("dx", function(d) {
		let dx = 2 * maxRadius + 10;
		return d.x < 180 ? dx : -dx;
	})
	.attr("dy", ".31em")
	.attr("text-anchor", function(d) { // move out text to the exterior for the left part of the circle
		return d.x < 180 ? "start" : "end";
	})
	.attr("transform", function(d) { // turn around text on the left
		return d.x < 180 ? null : "rotate(180)";
	})
	.text(function(d) {
		return d.fullname;
	})
	// add interactions on text
	.on("mouseover", mouseovered)
	.on("mouseout", mouseouted)
	.on("click", mouseclicked);
	
	// mouse click interactions
	function mouseclicked(d) {
		if (overable) { // if we are in overing mode
			overable = false;
			sourceFocus = d.name;
		} else if (sourceFocus == d.name) { // deselect our previous source node
			overable = true;
			sourceFocus = "";
		} else { // select another node
			sourceFocus = d.name;
		}
		
		if (!overable) {
			updateToolbox(d);
			highlightNode(d);
		} else {
			updateToolbox("");
			unhighlightNode();
		}
	}
	
	// mouse hover interactions
	function mouseovered(d) {
		if (overable) {
			updateToolbox(d);
			highlightNode(d);
		}
	}
	
	// reset node hovering
	function mouseouted(d) {
		if (overable) {
			unhighlightNode();
		}
	}
	
	function highlightNode(d) {
		that.node.each(function(n) {
			n.target = n.source = false;
		});
		
		// change html classes for edges adjacent to selected node
		
		that.link.classed("link--highlighted", function(l) {
			if (l.target.name === d.name) {
				return l.source.source = true;
			} else if (l.source.name === d.name) {
				return l.target.target = true;
			}else {
				return false;
			}
		}).filter(function(l) {
			return l.target === d || l.source === d;
		}).each(function() {
			this.parentNode.appendChild(this);
		});
		
		that.link.classed("link--unselected", function(l) {
			return l.target.name !== d.name && l.source.name !== d.name;
		});
		
		that.node.classed("node--selected", function(n) {
			return n.name === d.name;
		});
		// change html classes for node selected and their neighbours
		that.node.classed("node--highlighted", function(n) {
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

// update the right panel with selected node
// param node: the selected node with additional informations. undefined if no node is selected
let updateToolbox = function(node) {
	let name = "";
	if (node != undefined) {
		name = node.fullname;
		document.getElementById("panel_link").setAttribute("href", "http://" + node.name);
	}
	// update title
	document.getElementById("panel_title").innerHTML = name;
	
	// update logo icon
	if (node == undefined || node.logo == undefined) {
		document.getElementById("panel_logo").style.visibility = "hidden";
	} else {
		document.getElementById("panel_logo").style.visibility = "visible";
		document.getElementById("panel_logo").setAttribute("src", node.logo);
	}
	
	// update # articles
	if (node == undefined) {
		document.getElementById("panel_count_articles").innerHTML = "";
	} else {
		document.getElementById("panel_count_articles").innerHTML = parseInt(node.size).toLocaleString('fr') + " articles written";
	}
}

// scale the svg when the window is resized
let updateSize = function(event) {
	let container = d3.select("#canvas_container")[0][0];
	let w = container.offsetWidth;
	let h = container.offsetHeight;
	
	d3.select("#canvas")
	.attr("width", w)
	.attr("height", h);
	let translateAttr = "translate(" + w/2 + "," + h/2 + ")";
	let scaleFactor = 1;
	if (w < BASE_SIZE) {
		scaleFactor = w/BASE_SIZE;
	} else if (h < BASE_SIZE) {
		scaleFactor = h/BASE_SIZE;
	}
	let scaleAttr = "scale(" + scaleFactor + "," + scaleFactor + ")";
	d3.select("g")[0][0].setAttribute("transform", translateAttr + " " + scaleAttr);
};
window.onresize = updateSize;

// parse data and call graph drawing
function loadData(threshold) {
	let theme = 'all';
	updateThresholdDisplay(threshold);
	fetch('data/'+theme+'/0/threshold_' + threshold + '_permille.json', {mode: 'no-cors'})
	.then(function(res) {
		return res.json();
	}).then(function(json) {
		maxRadius = 16; // maximum circle radius
		
		// compute scales for display
		radiusScale.domain([d3.min(json.nodes, d => d.size), d3.max(json.nodes, d => d.size)]).range([1,maxRadius]);
		linkScale.domain([d3.min(json.edges, d => d.weight), d3.max(json.edges, d => d.weight)]).range([0.3,0.7]);
		
		nodesColorScale.domain([-10, 10]).range([0.0, 1.0]);
		linksColorScale.domain([0.0, d3.max(json.edges, d => d.tone_diff)]).range([0.0,1.0]);
		
		let nodes = [];
		let links = [];
		
		let nodesMap = {}; // used for later referencing in links
		
		let root = { // root for hierarchical bundling graph
			name: "root",
			children: [],
		};
		nodes.push(root);
		
		// append all nodes
		let i = 1;
		json.nodes.forEach(node => {
			// default icon (missing image)
			let icon = undefined;
			if (node.favicon != undefined) icon = node.favicon;
			
			let n = {
				name: node.id,
				fullname: node.name,
				group: i,
				key: i,
				parent: root,
				children: [],
				logo: icon,
				size: node.size,
				radius: radiusScale(node.size),
				edges: [],
				avg_tone: node.avg_tone,
			}
			
			nodesMap[n.name] = n;
			nodes.push(n);
			root.children.push(n);
			i++;
		});
		
		// append all edges
		json.edges.forEach(edge => {
			let e = {
				source: nodesMap[edge.source],
				target: nodesMap[edge.target],
				weight: edge.weight,
				tone_diff: edge.tone_diff,
			};
			nodesMap[edge.source].edges.push(e);
			nodesMap[edge.target].edges.push(e);
			links.push(e);
		});
		
		let data = {nodes: nodes, links: links};
		return data;
	}).then (function(data) {
		let container = d3.select("#canvas_container")[0][0];
		d3.select("#canvas").remove();
		d3.select("#canvas_container").append("svg").attr("id", "canvas");
		let bundle = new CircleGraph("#canvas", container.offsetWidth, container.offsetHeight - 50);
		bundle.setData(data);
	});
}

window.onload = function() {
	loadData(30);
	let logoElem = document.getElementById('panel_logo')
	logoElem.onerror = function() {
		logoElem.style.visibility = "hidden";
	}

	var mySlider = $("input.slider").slider();
	
	document.getElementById('slider_threshold').onchange = function() {
		loadData(this.value);
	}

	putGrayout();
    document.getElementById('theme_selecter').onchange = function() {
        console.log(this.value);
    }
}

function updateThresholdDisplay(threshold) {
	document.getElementById('threshold_value').innerHTML = threshold/10. + "%";
}

function decrementThreshold() {
	let elem = document.getElementById('slider_threshold');
	let current = elem.value;
	if (current > 0) {
		elem.value = parseInt(current) - 5;
	}
	elem.onchange();
}

function incrementThreshold() {
	let elem = document.getElementById('slider_threshold');
	let current = elem.value;
	if (current < 100) {
		elem.value = parseInt(current) + 5;
	}
	elem.onchange();
}

function removeGrayout() {
	document.getElementById('grayout').style.display = "none";
}

function putGrayout() {
	document.getElementById('grayout').style.display = "block";
}

// Bootstrap functions
$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function() {
  $('select').niceSelect();
});

$('#ex1').slider({
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});
