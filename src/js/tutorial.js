function initGrayout() {
    let classTooltip = 'tutorial-tooltip';
    let edgeTooltip = '<span id="right_tooltip" class="tutorial-tooltip"' +
        ' data-toggle="tooltip" data-trigger="manual" data-placement="right"' +
        ' title="Edges width correspond to the common coverage of events in number of articles"></span>';
    let allNodes = document.getElementsByTagName('circle');
    let aNode = allNodes[Math.floor(allNodes.length / 2.0)];
    aNode.setAttribute('class', classTooltip);
    aNode.setAttribute('data-toggle', 'tooltip');
    aNode.setAttribute('data-trigger', 'manual');
    aNode.setAttribute('data-placement', 'left');
    aNode.setAttribute('title', 'Nodes radius correspond to the number of articles written by that source');

    let allEdges = document.getElementsByTagName('path');
    let anEdge = allEdges[Math.floor(allEdges.length / 2.0)];

    anEdge.classList.add(classTooltip);
    anEdge.setAttribute('data-toggle', 'tooltip');
    anEdge.setAttribute('data-trigger', 'manual');
    anEdge.setAttribute('data-placement', 'right');
    anEdge.setAttribute('title', 'Edges width correspond to the common coverage of events in number of articles');
    console.log(anEdge);
}

function removeGrayout() {
    document.getElementById('grayout').style.display = "none";
    $(".tutorial-tooltip").tooltip('hide');
}

function putGrayout() {
    document.getElementById('grayout').style.display = "block";
    $(".tutorial-tooltip").tooltip('show');
}

