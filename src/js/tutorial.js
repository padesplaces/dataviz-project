function removeGrayout() {
    document.getElementById('grayout').style.display = "none";
    $(".tutorial-tooltip").tooltip('hide');
}

function putGrayout() {
    document.getElementById('grayout').style.display = "block";
    $(".tutorial-tooltip").tooltip('show');
}

