// scale the svg when the window is resized
function updateSize(event) {
    let container = d3.select("#canvas_container")[0][0];
    let w = container.offsetWidth;
    let h = container.offsetHeight;

    d3.select("#canvas")
        .attr("width", w)
        .attr("height", h);
    let translateAttr = "translate(" + w / 2 + "," + h / 2 + ")";
    let scaleFactor = 1;
    if (w < BASE_SIZE) {
        scaleFactor = w / BASE_SIZE;
    } else if (h < BASE_SIZE) {
        scaleFactor = h / BASE_SIZE;
    }
    let scaleAttr = "scale(" + scaleFactor + "," + scaleFactor + ")";
    d3.select("g")[0][0].setAttribute("transform", translateAttr + " " + scaleAttr);
}

window.onresize = updateSize;

function updateMonthSelect() {
    let index = parseInt(document.getElementById('time_slider_input').value);
    month = months[index];
    let labels = document.getElementsByClassName('time_month_label');
    Array.prototype.forEach.call(labels, function (label) {
        label.classList.remove("time_month_label_selected");
    });
    labels[index].classList.add("time_month_label_selected");
    loadData();
}

let darkMode = false;

function switchDarkMode() {
    darkMode = !darkMode;
    let element = document.getElementById('main_container');
    if (darkMode) {
        element.classList.add("dark-mode");
    } else {
        element.classList.remove("dark-mode");
    }
}

function updateTimeSlider() {
    document.getElementById('time_slider_input').value = months.findIndex(elem => elem === month);
}

function updateThreshold() {
    document.getElementById('slider_threshold').value = threshold;
}

function updateThemeFilter() {
    let div = document.getElementsByClassName('nice-select')[0];
    div.children[0].innerHTML = themes[theme];
    for (let li of div.children[1].children) {
        if (li.innerHTML === themes[theme]) {
            li.className = "option selected";
        } else {
            li.className = "option";
        }
    }
}


// Change input value on label click
$('.range-labels li').on('click', function () {
    var index = $(this).index();

    $rangeInput.val(index + 1).trigger('input');

});

// Bootstrap functions
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

$(document).ready(function () {
    $('select').niceSelect();
});

$('#ex1').slider({
    formatter: function (value) {
        return 'Current value: ' + value;
    }
});
