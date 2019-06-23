// @TODO: YOUR CODE HERE!
function makeResponsive() {

    // Clear svg if not empty when browser loads
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // svg container
    var svgHeight = 460;
    var svgWidth = 660;

    // margins

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    // Establish chart height and width
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // Create container

    var svg = d3.select("#scatter").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // Shift by margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load the data from the csv

    d3.csv("assets/data/data.csv")
        .then(function (stateData) {
            // Convert data types to numeric where appropriate
            stateData.forEach(function (datum) {
                datum.age = +datum.age;
                datum.ageMoe = +datum.ageMoe;
                datum.healthcare = +datum.healthcare;
                datum.healthcareHigh = +datum.healthcareLow;
                datum.income = +datum.income;
                datum.incomeMoe = +datum.incomeMoe;
                datum.obesity = +datum.obesity;
                datum.obesityHigh = +datum.obesityHigh;
                datum.obesityLow = +datum.obesityLow;
                datum.poverty = +datum.poverty;
                datum.povertyMoe = +datum.povertyMoe;
                datum.smokes = +datum.smokes;
                datum.smokesHigh = +datum.smokesHigh;
                datum.smokesLow = +datum.smokesLow;

            });
            console.log(stateData)
            
            // Scale y to height

            var yScale = d3.scaleLinear()
                .domain([d3.min(stateData, d => d.healthcare)-1,d3.max(stateData, d => d.healthcare)])
                .range([chartHeight, 0]);
            // Scale x to width

            var xScale = d3.scaleLinear()
                .domain([(d3.min(stateData, d => d.poverty))-1, d3.max(stateData, d => d.poverty)])
                .range([0, chartWidth])
            // Create axes
            var yAxis = d3.axisLeft(yScale);
            var xAxis = d3.axisBottom(xScale);

            // Transform x axis to place it at the bottom of the chart
            chartGroup.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(xAxis);
            // Apply the y axis
            chartGroup.append("g")
                .call(yAxis);

            // Create tooltip info for each point
            var toolTip = d3.tip()
                .attr("class", "d3-tip")
                .offset([80, -60])
                .html(function(d) {
                    return(`<strong>${d.abbr}</strong>
                    ${d.poverty}, ${d.healthcare}`);
                })
           // Append data to chartGroup
            var circlesGroup = chartGroup.selectAll("circle")
                .data(stateData)
                .enter()
                .append("circle")
                .attr("cx", d =>xScale(d.poverty))
                .attr("cy", d =>yScale(d.healthcare))
                .attr("r", "10")
                .attr("fill", "rgb(12,240,233)")
                .attr("opacity", "0.5")
                .attr("stroke-width", "1")
                .attr("stroke", "black")
                .on("mouseover", toolTip.show)
                .on("mouseout", toolTip.hide)
                


                // Still need to add state abbr to each point
            var textGroup = chartGroup.selectAll("text.circle-text")
                .data(stateData)
                .enter()
                .append("text")
                .classed("circle-text", true)
                .attr("x", d =>xScale(d.poverty))
                .attr("y", d =>yScale(d.healthcare))
                .attr("text-anchor", "middle")
                .attr("fill", "gray")
                .attr("font-size", "10px")
                .text(d=>d.abbr);
            
                circlesGroup.call(toolTip);
            // Append axis labels
            chartGroup.append("text")
                .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`)
                .attr("x", 0)
                .attr("y", 20)
                .classed("axis-text", true)
                .text("In Poverty (%)");
            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -30)
                .attr("x", 0-(chartHeight/2) -80)
                .classed("axis-text", true)
                .text("Lacks Healthcare (%)");
        });



}
makeResponsive();

// Respond to resizing of window
d3.select(window).on("resize", makeResponsive);



