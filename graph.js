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

class NetworkGraph {
	constructor(figure_element_id, nodes, edges){
		this.svg = figure_element_id;
		this.nodes = nodes;
		this.edges = edges;
	}

	//TODO : integrate code below into class
}

const width = 960,
    height = 500;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

const force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

d3.json("data.json", function(json) {
	force.nodes(json.nodes)
	      .links(json.edges)
	      .start();

	var edge = svg.selectAll(".link")
				  .data(json.edges)
				.enter().append("line")
				  .attr("class", "link")
				.style("stroke-width", function(d) { return 10*d.weight; });

	var node = svg.selectAll(".node")
				  .data(json.nodes)
				.enter().append("g")
				  .attr("class", "node")
				  .call(force.drag);

	node.append("circle")
	  .attr("r","5");

	node.append("text")
	  .attr("dx", 12)
	  .attr("dy", ".35em")
	  .text(function(d) { return d.id });

	force.on("tick", function() {
		edge.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});
});


whenDocumentLoaded(() => {
	//graph = new NetworkGraph(svg, nodes, edges);
});