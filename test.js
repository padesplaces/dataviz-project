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

const nodes = [{'id': 0},
		 {'id': 1},
		 {'id': 2},
		 {'id': 3},
		 {'id': 4},
		 {'id': 5},
		 {'id': 6},
		 {'id': 7},
		 {'id': 8},
		 {'id': 9}];

const edges = [{'source': 1, 'target': 0, 'weight': 0.015328895125875208},
				 {'source': 2, 'target': 0, 'weight': 0.45968402528082064},
				 {'source': 2, 'target': 1, 'weight': 0.40656112684001355},
				 {'source': 3, 'target': 0, 'weight': 0.5326208599654775},
				 {'source': 3, 'target': 1, 'weight': 0.10174090715953132},
				 {'source': 3, 'target': 2, 'weight': 0.5536285978961399},
				 {'source': 4, 'target': 0, 'weight': 0.5327166514223465},
				 {'source': 4, 'target': 1, 'weight': 0.23475232249253475},
				 {'source': 4, 'target': 2, 'weight': 0.23405076891139132},
				 {'source': 5, 'target': 0, 'weight': 0.1850556507566392},
				 {'source': 5, 'target': 1, 'weight': 0.18655549847000075},
				 {'source': 5, 'target': 3, 'weight': 0.10953456786853866},
				 {'source': 5, 'target': 4, 'weight': 0.3962575646961629},
				 {'source': 6, 'target': 4, 'weight': 0.025567902426173905},
				 {'source': 6, 'target': 5, 'weight': 0.5606131266964041},
				 {'source': 7, 'target': 0, 'weight': 0.43850195889296095},
				 {'source': 7, 'target': 1, 'weight': 0.24173994053569725},
				 {'source': 7, 'target': 3, 'weight': 0.0568049182444067},
				 {'source': 7, 'target': 4, 'weight': 0.2708881565427028},
				 {'source': 7, 'target': 5, 'weight': 0.4825442014606812},
				 {'source': 7, 'target': 6, 'weight': 0.017636760545536645},
				 {'source': 8, 'target': 2, 'weight': 0.4942781485771912},
				 {'source': 8, 'target': 3, 'weight': 0.037183885641004166},
				 {'source': 8, 'target': 5, 'weight': 0.2027769001414017},
				 {'source': 8, 'target': 6, 'weight': 0.14647736549558954},
				 {'source': 8, 'target': 7, 'weight': 0.25438396501647964},
				 {'source': 9, 'target': 6, 'weight': 0.2351040203731709}];


class NetworkGraph {
	constructor(figure_element_id, nodes, edges){
		this.svg = figure_element_id;
		this.nodes = nodes;
		this.edges = edges;
	}

	draw() {

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

force.nodes(nodes)
      .links(edges)
      .start();

var link = svg.selectAll(".link")
			  .data(edges)
			.enter().append("line")
			  .attr("class", "link")
			.style("stroke-width", function(d) { return 10*d.weight; });

var node = svg.selectAll(".node")
			  .data(nodes)
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
	link.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });

	node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});


whenDocumentLoaded(() => {
	graph = new NetworkGraph(svg, nodes, edges);
});