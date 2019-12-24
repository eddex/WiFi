// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 40, left: 250 },
  width = 860 - margin.left - margin.right,
  height = 2400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#bar-chart-holder")
  .append("svg")
  .attr("width", "100%")
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.json("data/all_scores.json", function (data) {
  data.data = data.data.sort(function (a, b) {
    return a.score - b.score;
  });

  console.log(data.data)



  ///////////////////////////////////////////////////////////////////////////////////////////
  // X axis: scale and draw:
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");





  ///////////////////////////////////////////////////////////////////////////////////////////
  // Y axis: scale and draw:
  var y = d3.scaleBand()
    .range([0, height])
    .domain(data.data.map(function (d) { return d.country; })) //max score 100
    .padding(.1);

  svg2.append("g")
    .call(d3.axisLeft(y));

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  ///////////////////////////////////////////////////////////////////////////////////////////
  // append the bar rectangles to the svg element
  svg2.selectAll("myRect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function (d) { return y(d.country); })
    .attr("width", function (d) { return x(d.score); })
    .attr("height", y.bandwidth())
    .attr("text", "test text yeahiii")
    .style("fill", "#1A1C29")
    .on("mouseover", function (d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip
        .html(d.country + "<br/> Score " + d.score)
        .style("left", (d3.event.pageX + 30) + "px")
        .style("top", (d3.event.pageY) + "px")
        .style("background-color", "#d0d0d0")
        .style("padding", "3px");
    })
    .on("mouseout", function (d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })

});