const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

function showStory() {
    return new Promise(function (resolve, reject) {
        // setup for story
        month = 'Jul-18';
        threshold = 100;
        theme = 'all';
        updateTimeSlider();
        updateThreshold();
        updateThemeFilter();

        loadData();
    }).then(sleep(1000)).then(_ => console.log("ho !"));
}
