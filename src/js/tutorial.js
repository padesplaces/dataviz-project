let grayout = false;

function initGrayout() {
    let classTooltip = 'tutorial-tooltip';
    let allNodes = document.getElementsByTagName('circle');
    let aNode = allNodes[Math.floor(allNodes.length / 2.0)];
    aNode.setAttribute('class', classTooltip);
    aNode.setAttribute('data-toggle', 'tooltip');
    aNode.setAttribute('data-trigger', 'manual');
    aNode.setAttribute('data-placement', 'left');
    aNode.setAttribute('title', 'The node radius corresponds to the number of articles written by that source');

    let allEdges = document.getElementsByTagName('path');
    let anEdge = allEdges[Math.floor(allEdges.length / 2.0)];
    anEdge.classList.add(classTooltip);
    anEdge.setAttribute('data-toggle', 'tooltip');
    anEdge.setAttribute('data-trigger', 'manual');
    anEdge.setAttribute('data-placement', 'right');
    anEdge.setAttribute('title', 'The edge width is proportional to the number of events covered by both sources');
}

function removeGrayout() {
    document.getElementById('grayout').style.display = "none";
    $(".tooltip").remove();
    grayout = false;
    showStory();
}

function putGrayout() {
    hideStory();
    document.getElementById('grayout').style.display = "block";
    $(".tutorial-tooltip").tooltip('show');
    grayout = true;
}

