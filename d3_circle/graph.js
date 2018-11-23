const BASE_SIZE = 765;

var maxRadius = 0;

var radiusScale = d3.scale.sqrt();
var linkScale = d3.scale.sqrt();

function Bundle(container, w, h) {
	
	var svg = this.svg = d3.select(container)
	.attr("width", w)
	.attr("height", h)
	.append("svg:g")
	.attr("transform", "translate(" + w/2 + "," + h/2 + ")");
	
	var cluster = this.cluster = d3.layout.cluster()
	.size([360, 240])
	.sort(function(a, b) {
		return d3.ascending(a.name, b.name);
	});
	
	var bundle = this.bundle = d3.layout.bundle();
	var line = this.line = d3.svg.line.radial()
	.interpolate("bundle")
	.tension(0.6)
	.radius(function(d) {
		return d.y;
	})
	.angle(function(d) {
		return d.x / 180 * Math.PI;
	});
}


Bundle.prototype.set_data = function(graph) {
	var that = this;
	var nodes = that.cluster.nodes(graph.nodes[0]);
	var splines = that.bundle(graph.links);
	that.link = that.svg.selectAll("path.link")
	.data(graph.links)
	.enter().append("svg:path")
	.attr("class", function(d) {
		return "link source-" + d.source.name + " target-" + d.target.name;
	})
	.attr("d", function(d, i) {
		return that.line(splines[i]);
	})
	.style("stroke-opacity", function(d) {
		return linkScale(d.weight);
	});;
	
	
	that.node = that.svg.selectAll("g.node")
	.data(nodes.filter(function(n) {
		return !n.children;
	}))
	.enter().append("svg:g")
	.attr("class", "node")
	.attr("id", function(d) {
		return "node-" + d.key;
	})
	.attr("transform", function(d) {
		return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
	})
	.append("svg:circle")
	.attr("r", function(d) {
		return radiusScale(d.size);
	})
	.attr("cx", function(d) {
		return maxRadius + 5;
	})
	.on("mouseover", mouseovered)
	.on("mouseout", mouseouted);
	
	that.svg.selectAll("g.node")
	.append("svg:text")
	.attr("dx", function(d) {
		let dx = 2 * maxRadius + 10;
		return d.x < 180 ? dx : -dx;
	})
	.attr("dy", ".31em")
	.attr("text-anchor", function(d) {
		return d.x < 180 ? "start" : "end";
	})
	.attr("transform", function(d) {
		return d.x < 180 ? null : "rotate(180)";
	})
	.text(function(d) {
		return d.fullname;
	})
	.on("mouseover", mouseovered)
	.on("mouseout", mouseouted);
	
	
	// add classes on hovers for interaction
	function mouseovered(d) {
		updateToolbox(d);
		that.node
		.each(function(n) {
			n.target = n.source = false;
		});
		
		that.link
		.classed("link--target", function(l) {
			if (l.target.name === d.name) {
				return l.source.source = true;
			}
		})
		.classed("link--source", function(l) {
			if (l.source.name === d.name) {
				return l.target.target = true;
			}
		})
		.filter(function(l) {
			return l.target === d || l.source === d;
		})
		.each(function() {
			this.parentNode.appendChild(this);
		});
		
		that.node
		.classed("node--target", function(n) {
			return n.target;
		})
		.classed("node--source", function(n) {
			return n.source;
		});
		
		
	}
	
	function mouseouted(d) {
		
		updateToolbox(null);
		that.link
		.classed("link--target", false)
		.classed("link--source", false);
		
		that.node
		.classed("node--target", false)
		.classed("node--source", false);
		
	}
};


let updateToolbox = function(node) {
	let name = "";
	if (node != undefined) {
		name = node.fullname;
	}
	document.getElementById("panel_title").innerHTML = name;
	
	if (node == undefined || node.logo == undefined) {
		document.getElementById("panel_logo").style.visibility = "hidden";
	} else {
		document.getElementById("panel_logo").style.visibility = "visible";
		document.getElementById("panel_logo").setAttribute("src", node.logo);
	}

	if (node == undefined) {
		document.getElementById("panel_count_articles").innerHTML = "";
	} else {
		document.getElementById("panel_count_articles").innerHTML = parseInt(node.size).toLocaleString('fr') + " articles written";
	}
}

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

Promise.all([
	fetch('top50-US-year-3000.json', {mode: 'no-cors'})
	.then(function(res) {
		return res.json()
	})
	.then(function(json) {
		maxRadius = 16;
		radiusScale.domain([d3.min(json.nodes, d => d.size), d3.max(json.nodes, d => d.size)]).range([1,maxRadius]);
		linkScale.domain([d3.min(json.edges, d => d.weight), d3.max(json.edges, d => d.weight)]).range([0.1,0.9]);
		
		let nodes = [];
		let links = [];
		let nodesMap = {};
		var root = {
			name: "root",
			children: [],
		};
		nodes.push(root);
		
		let i = 1;
		json.nodes.forEach(node => {
			// default icon (missing image)
			let icon = undefined;
			if (node.favicon != undefined) {
				icon = node.favicon;
			}
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
			}
			nodesMap[n.name] = n;
			nodes.push(n);
			root.children.push(n);
			i++;
		});
		
		json.edges.forEach(edge => {
			let e = {
				source: nodesMap[edge.source],
				target: nodesMap[edge.target],
				weight: edge.weight,
			};
			nodesMap[edge.source].edges.push(e);
			nodesMap[edge.target].edges.push(e);
			links.push(e);
		});
		
		let data = {nodes: nodes, links: links};
		return data;
	})
	.then (function(data) {
		let container = d3.select("#canvas_container")[0][0];
		let bundle = new Bundle("#canvas", container.offsetWidth, container.offsetHeight - 50);
		bundle.set_data(data);
	})
	
]);

// Bootstrap
$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})
