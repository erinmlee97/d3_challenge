// Create width & height for svg
// svg container
var svgWidth = 960;
var svgHeight = 500;

// margin
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create a svg container
var svg = d3
  .select("scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
