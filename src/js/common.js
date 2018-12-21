let radiusScale = d3.scale.sqrt();
let linkScale = d3.scale.linear();
let nodesColorScale = d3.scale.linear();
let linksColorScale = d3.scale.sqrt();

let hoverAble = true;
let sourceFocus = "";

let month = 'full_year';
let theme = 'all';
let threshold = 30;

let months = ['full_year', 'Dec-17', 'Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18',
    'Jun-18', 'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18'];
let themes = {
    "all": "-",
    "conflict": "Conflict",
    "eco": "Economy",
    "env":"Environment",
    "health":"Health",
    "social":"Social"
};