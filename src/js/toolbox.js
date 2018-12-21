// update the right panel with selected node
// param node: the selected node with additional informations. undefined if no node is selected
function updateToolbox(node) {
    if (node) {
        document.getElementById("panel_title").innerHTML = node.fullname;
        document.getElementById("panel_link").setAttribute("href", "http://" + node.name);
        document.getElementById("themes-histogram").innerHTML = "";
        document.getElementById("panel_count_articles").innerHTML = parseInt(node.size).toLocaleString('fr') + " articles written this year";
        plotHistogram(node.name, month);
    } else {
        document.getElementById("panel_title").innerHTML = "";
        document.getElementById("panel_count_articles").innerHTML = "";
        clean_histogram();
    }

    if (node && node.logo) {
        document.getElementById("panel_logo").style.visibility = "visible";
        document.getElementById("panel_logo").setAttribute("src", node.logo);
    } else {
        document.getElementById("panel_logo").style.visibility = "hidden";
        document.getElementById("panel_logo").setAttribute("src", "");
    }
}

function plotHistogram(source_name, source_month) {
    var margin = {top: 20, right: 20, bottom: 40, left: 60},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#themes-histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var y = d3.scale.linear().range([height, 0]);

    d3.csv("../data/histograms/" + source_month + "/" + source_name + ".csv", function (error, data) {
        if (error) throw error;

        x.domain(data.map(function (d) {
            return d.Theme;
        }));
        y.domain([0, d3.max(data, function (d) {
            return parseInt(d.count);
        })]);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.Theme);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.count);
            })
            .attr("height", function (d) {
                return height - y(d.count);
            })
            .style("fill", function (d) {
                return d3.interpolateRdBu(nodesColorScale(d.avg_tone));
            });

        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .call(yAxis);

    });
}

function clean_histogram() {
    document.getElementById("themes-histogram").innerHTML = "";
}

function updateThresholdDisplay(threshold) {
    document.getElementById("threshold_value").innerHTML = threshold / 10. + "%";
}

function decrementThreshold() {
    let elem = document.getElementById("slider_threshold");
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
