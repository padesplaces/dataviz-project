const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

let storyMode = false;

let foxNewsText = 'Big news sources like Fox News, that cover lots of news, share connections with almost every other sources. ' +
    'This implies a tone difference with others near the median, because of the large size of common coverage.';
let onionText = "The Onion is known to be a satirical source, and thus is understandably in opposition with every other news source. " +
    "We can clearly see this with the dark edges in almost all situations when The Onion is involved.";
let nbcText = 'The NBC network shows great proximity both in terms of the size of their common coverage and in their tone. ' +
    'Indeed, you can see these large yellow lines representing closeness of agenda for these sites.';


function showStory() {
    return new Promise(function (resolve, reject) {
        // setup for story
        month = 'Dec-17';
        threshold = 70;
        theme = 'conflict';
        updateTimeSlider();
        updateThreshold();
        updateThemeFilter();

        loadData();


        let foxNews = findNode('Fox News ');
        foxNews.classList.add('story1-tooltip');
        foxNews.setAttribute('data-toggle', 'tooltip');
        foxNews.setAttribute('data-trigger', 'manual');
        foxNews.setAttribute('data-placement', 'right');
        foxNews.setAttribute('title', foxNewsText);


        let onion = findNode('The Onion');
        onion.classList.add('story1-tooltip');
        onion.setAttribute('data-toggle', 'tooltip');
        onion.setAttribute('data-trigger', 'manual');
        onion.setAttribute('data-placement', 'left');
        onion.setAttribute('title', onionText);


        let nbc = findNode('NBC New York');
        nbc.classList.add('story1-tooltip');
        nbc.setAttribute('data-toggle', 'tooltip');
        nbc.setAttribute('data-trigger', 'manual');
        nbc.setAttribute('data-placement', 'bottom');
        nbc.setAttribute('title', nbcText);

        $(".story1-tooltip").tooltip('show');
        setTimeout(function() {
            storyMode = true;
        }, 100);

    });
}

function findNode(name) {
    for (let elem of document.getElementsByClassName('node-label')) {
        if (elem.innerHTML === name) {
            return elem;
        }
    }
}

function hideStory() {
    $('.tooltip').remove();
    storyMode = false;
}

function toggleStory() {
    if (storyMode) {
        hideStory();
    } else {
        showStory();
    }
}

window.onclick = function() {
  if (storyMode) {
      hideStory();
  }
};