// parse data and call graph drawing
function loadData() {
    updateThresholdDisplay(threshold);
    return fetch('../data/' + theme + '/' + month + '/threshold_0_permille.json', {mode: 'no-cors'})
        .then(function (res) {
            return res.json();
        })
        .then(function (json) {
            return {
                linkMinWeight: d3.min(json.edges, d => d.weight),
                linkMaxWeight: d3.max(json.edges, d => d.weight),
                toneMin: d3.min(json.edges, d => d.tone_diff),
                toneMax: d3.max(json.edges, d => d.tone_diff),
            };
        })
        .then(function (scaleValues) {
            document.getElementById('viridis_scale_max').innerText = (scaleValues.toneMax*0.4).toFixed(2);
            document.getElementById('viridis_scale_min').innerText = (scaleValues.toneMin).toFixed(2);

            return fetch('../data/' + theme + '/' + month + '/threshold_' + threshold + '_permille.json', {mode: 'no-cors'})
                .then(function (res) {
                    return res.json();
                })
                .then(function (json) {
                    maxRadius = 16; // maximum circle radius

                    // compute scales for display
                    radiusScale.domain([d3.min(json.nodes, d => d.size), d3.max(json.nodes, d => d.size)]).range([1, maxRadius]);
                    linkScale.domain([scaleValues.linkMinWeight, scaleValues.linkMaxWeight]).range([0.0, 15.0]);

                    nodesColorScale.domain([-10, 10]).range([0.0, 1.0]);
                    linksColorScale.domain([scaleValues.toneMin, scaleValues.toneMax * 0.4]).range([0.0, 1.0]);

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
                        if (node.favicon !== undefined) icon = node.favicon;

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
                        };

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
                })
                .then(function (data) {
                    let container = d3.select("#canvas_container")[0][0];
                    d3.select("#canvas").remove();
                    d3.select("#canvas_container").append("svg").attr("id", "canvas");
                    let bundle = new CircleGraph("#canvas", container.offsetWidth, container.offsetHeight - 50);
                    bundle.setData(data);
                });
        });
}