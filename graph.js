/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

drag = simulation => {

	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}

	return d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);
}

// https://medium.com/@nick3499/d3-scaleordinal-d3-schemecategory10-categorical-ordinal-scale-cab259c4d1e5
const color = d3.scaleOrdinal(d3.schemeCategory20);
const radiusScale = d3.scaleSqrt();
const edgeScale = d3.scaleSqrt();

const svg = d3.select("#canvas")
	.attr("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight) //size ??

const svg_viewbox = svg.node().viewBox.animVal;
const width = svg_viewbox.width;
const height = svg_viewbox.height;

const clusters = {'pk': {'x': 1000.0, 'y': 400.0},
 'ps': {'x': 984.7759065022574, 'y': 476.53668647301794},
 'uk': {'x': 941.4213562373095, 'y': 541.4213562373095},
 'mx': {'x': 876.536686473018, 'y': 584.7759065022574},
 'es': {'x': 800.0, 'y': 600.0},
 'nz': {'x': 723.463313526982, 'y': 584.7759065022574},
 'ru': {'x': 658.5786437626905, 'y': 541.4213562373095},
 'bg': {'x': 615.2240934977426, 'y': 476.536686473018},
 'com': {'x': 600.0, 'y': 400.0},
 'ro': {'x': 615.2240934977426, 'y': 323.46331352698206},
 'net': {'x': 658.5786437626905, 'y': 258.5786437626905},
 'cz': {'x': 723.4633135269819, 'y': 215.2240934977427},
 'it': {'x': 800.0, 'y': 200.0},
 'cu': {'x': 876.536686473018, 'y': 215.22409349774267},
 'br': {'x': 941.4213562373095, 'y': 258.5786437626905},
 'kr': {'x': 984.7759065022573, 'y': 323.4633135269819},
 'mk': {'x': 1000.0, 'y': 399.99999999999994}};

d3.json("data/network-month-300.json", function(json) {

	radiusScale.domain([d3.min(json.nodes, d => d.size), d3.max(json.nodes, d => d.size)]).range([5,15]);
	edgeScale.domain([d3.min(json.edges, d => d.weight), d3.max(json.edges, d => d.weight)]).range([1,10]);

	var simulation = d3.forceSimulation(json.nodes)
		.force('link', d3.forceLink()
			.links(json.edges)
			.distance(200)
			.id((d) => d.id))
		.force('charge', d3.forceManyBody().strength(-100))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('x', d3.forceX((d)=>clusters[d.group].x).strength(0.8))
		.force('y', d3.forceY((d)=>clusters[d.group].y).strength(0.8))
		//.force("collide", d3.forceCollide(20))

	var edge = svg.selectAll(".link")
		.data(json.edges)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return edgeScale(d.weight); });

	var node = svg.selectAll(".node")
		.data(json.nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr('fill', (d) => color(d.group))
		.on("mouseover", function(d) {
			var g = d3.select(this); // The node
			// The class is used to remove the additional text later
			var info = g.append('text')
			 .classed('info', true)
			 .attr('x', 12)
			 .attr('y', ".35em")
			 .text(function(d) { return d.id });
		})
		.on("mouseout", function(d) { d3.select(this).select('text.info').remove() })
		.call(drag(simulation));
		
	node.append("circle")
		.attr("r", (d) => radiusScale(d.size));
		
	simulation.on("tick", function() {
		edge.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});
});

whenDocumentLoaded(() => {
	// graph = new NetworkGraph(svg, nodes, edges);
});
