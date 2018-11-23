function getRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

let colorPalette = {};

Promise.all([
	fetch('../../data/old/network-month-200.json', {mode: 'no-cors'})
	.then(function(res) {
		return res.json()
	})
	.then(function(json){
		let elems = [];
		json.nodes.forEach(node => {
			if (!colorPalette.hasOwnProperty(node.group)) {
				console.log(node.group);
				colorPalette[node.group] = getRandomColor();
			}
			elems.push({
				group: "nodes",
				data: { 
					id : node.id,
					weight: node.size,
					color: colorPalette[node.group],
				}
			});
		});
		json.edges.forEach(edge => {
			elems.push({
				group: "edges",
				data: { 
					source: edge.source,
					target: edge.target,
					weight: edge.weight,
					directed: false,
				}
			});
		});
		return elems;
	})
	.then(function(nodes){
		console.log(colorPalette);
		var cy = cytoscape({
			container: document.getElementById('cy'), // container to render in
			elements: nodes,
			style: [ // the stylesheet for the graph
				{
					selector: 'node',
					style: {
						'font-size': '8px',
						'label': 'data(id)',
						'background-color': 'data(color)',
						'width': 'mapData(weight, 500, 50000, 1, 60)',
						'height': 'mapData(weight, 500, 50000, 1, 60)',
					}
				},
					
					{
						selector: 'edge',
						style: {
							'width': 'mapData(width, 0, 1000, 1, 5)',
							'line-color': '#ccc',
							'target-arrow-color': '#ccc',
							'target-arrow-shape': 'triangle'
						}
					},
				],  
				layout: {
					name: 'circle',
					
					fit: true, // whether to fit the viewport to the graph
					padding: 30, // the padding on fit
					avoidOverlap: false, // prevents node overlap, may overflow boundingBox and radius if not enough space
					nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
					spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
					radius: undefined, // the radius of the circle
					startAngle: 3 / 2 * Math.PI, // where nodes start in radians
					sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
					clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
					sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
					animate: false, // whether to transition the node positions
					animationDuration: 500, // duration of animation in ms if enabled
					animationEasing: undefined, // easing of animation if enabled
					animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
					ready: undefined, // callback on layoutready
					stop: undefined, // callback on layoutstop
					transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 
					
				}
				
			});  
			
			// cy.autoungrabify( true );
			cy.zoomingEnabled( false );
			
		})
		
		
	]);