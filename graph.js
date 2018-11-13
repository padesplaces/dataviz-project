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
const scale = d3.scaleOrdinal(d3.schemeCategory10);

class NetworkGraph {
	constructor(figure_element_id, nodes, edges){
		this.svg = figure_element_id;
		this.nodes = nodes;
		this.edges = edges;
	}

	//TODO : integrate code below into class
}

const width = 960, height = 500;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

d3.json("data.json", function(json) {

	var simulation = d3.forceSimulation(json.nodes)
		.force('link', d3.forceLink()
			.links(json.edges)
			.id((d) => d.id))
		.force('charge', d3.forceManyBody().strength(-100))
		.force('center', d3.forceCenter(width / 2, height / 2))

	var edge = svg.selectAll(".link")
		.data(json.edges)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return Math.sqrt(d.weight); });

	var node = svg.selectAll(".node")
		.data(json.nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr('fill', (d) => scale(d.group))
		.call(drag(simulation));

	node.append("circle")
		.attr("r","5");

	node.append("text")
		.attr("dx", 12)
		.attr("dy", ".35em")
		.text(function(d) { return d.id });

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
