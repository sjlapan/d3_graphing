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
                .domain(d3.extent(stateData, d => d.healthcare))
                .range([chartHeight, 0]);
            // Scale x to width

            var xScale = d3.scaleLinear()
                .domain([0, d3.max(stateData, d => d.poverty)])
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
            // Append data to chartGroup
            var circlesGroup = chartGroup.selectAll("circle")
                .data(stateData)
                .enter()
                .append("circle")
                .attr("cx", d =>xScale(d.poverty))
                .attr("cy", d =>yScale(d.healthcare))
                .attr("r", "10")
                .attr("fill", "gray")
                .attr("stroke-width", "1")
                .attr("stroke", "black");

        });



}
makeResponsive();

// Respond to resizing of window
d3.select(window).on("resize", makeResponsive);



