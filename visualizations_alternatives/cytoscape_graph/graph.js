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
	fetch('../../data/all/full_year/threshold_35_permille.json', {mode: 'no-cors'})
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
					name: 'cose',
					idealEdgeLength: 100,
					nodeOverlap: 20,
					refresh: 20,
					fit: true,
					padding: 30,
					randomize: false,
					componentSpacing: 100,
					nodeRepulsion: 400000,
					edgeElasticity: 100,
					nestingFactor: 5,
					gravity: 80,
					numIter: 1000,
					initialTemp: 200,
					coolingFactor: 0.95,
					minTemp: 1.0
				  },
				
			});  
			
			cy.autoungrabify( true );
			cy.zoomingEnabled( false );
			
		})
		
		
	]);