// Pierre-Antoine Desplaces, Loïc Serafin


window.onload = function () {
    loadData().then(putGrayout);

    let logoElem = document.getElementById('panel_logo');
    logoElem.onerror = function () {
        logoElem.style.visibility = "hidden";
    };
    document.getElementById('slider_threshold').onchange = function () {
        threshold = parseInt(this.value);
        loadData();
    };
    document.getElementById('time_slider_input').onchange = updateMonthSelect;
    document.getElementById('theme_selecter').onchange = function () {
        theme = this.value;
        loadData();
    };

    updateMonthSelect();
};
