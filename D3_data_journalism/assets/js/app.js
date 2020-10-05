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
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(dData, chosenXAxis, width) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(dData, d => d[chosenXAxis]) * 0.8,
        d3.max(dData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  // Function used for updating y-scale var upon click on axis label.
function yScale(data, chosenYAxis, height) {
    // Create scales.
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * .8,
            d3.max(data, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);
    return yLinearScale;
}
// Function used for updating yAxis var upon click on axis label.
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    var xlabel;
    // Conditional x axis
    if (chosenXAxis === "poverty") {
        xlabel = "Poverty:";
    }
    else if (chosenXAxis === "age"){
        xlabel = "Age:";
    }
    else {
        xlabel = "Household Income:";
    }
    var ylabel;
    // Conditional y axis
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    } 
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokers: "
    } 
    else {
        var ylabel = "Obesity: "
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([120, -60])
      .attr("class", "d3-tip")
      .html(function(d) {
        if (chosenXAxis === "age") {
            // All yAxis tooltip labels presented and formated as %.
            // Display Age without format for xAxis.
            return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
            } 
            else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
            // Display Income in dollars for xAxis.
            return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
            } 
            else {
            // Display Poverty as percentage for xAxis.
            return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
            }      
    });
  
    circlesGroup.call(toolTip);
  
    circlesGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    textGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(dData, err) {
    if (err) throw err;
    // Parse data.
    dData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.obesity = +data.obesity;
    });

    // Create x/y linear scales.
    var xLinearScale = xScale(dData, chosenXAxis, width);
    var yLinearScale = yScale(dData, chosenYAxis, height);
    // Create initial axis functions.
    var bottomAxis =d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x-axis
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y axis.
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Set data used for circles.
    var circlesGroup = chartGroup.selectAll("circle")
        .data(dData);

    // Bind data.
    var elemEnter = circlesGroup.enter();

    // Create circles.
    var circle = elemEnter.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .classed("stateCircle", true);
    
    // Create circle text.
    var circleText = elemEnter.append("text")            
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", ".35em") 
        .text(d => d.abbr)
        .classed("stateText", true);
