// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 90},
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
  data.data = data.data.sort(function(a, b) {
    return a.score - b.score;
  });

  const codes = [
    "AF",
    "AL",
    "DZ",
    "AD",
    "AO",
    "AI",
    "AG",
    "AR",
    "AM",
    "AW",
    "AU",
    "AT",
    "AZ",
    "BS",
    "BH",
    "BD",
    "BB",
    "BY",
    "BE",
    "BZ",
    "BJ",
    "BM",
    "BT",
    "BO",
    "BA",
    "BW",
    "BR",
    "IO",
    "UM",
    "VG",
    "BN",
    "BG",
    "BF",
    "BI",
    "KH",
    "CM",
    "CA",
    "CV",
    "KY",
    "CF",
    "TD",
    "CL",
    "CN",
    "CO",
    "KM",
    "CG",
    "CD",
    "CK",
    "CR",
    "HR",
    "CU",
    "CY",
    "CZ",
    "DK",
    "DJ",
    "DM",
    "DO",
    "EC",
    "EG",
    "SV",
    "GQ",
    "ER",
    "EE",
    "ET",
    "FK",
    "FO",
    "FJ",
    "FI",
    "FR",
    "GF",
    "GA",
    "GM",
    "GE",
    "DE",
    "GH",
    "GI",
    "GR",
    "GL",
    "GD",
    "GT",
    "GG",
    "GN",
    "GW",
    "GY",
    "HT",
    "VA",
    "HN",
    "HK",
    "HU",
    "IS",
    "IN",
    "ID",
    "CI",
    "IR",
    "IQ",
    "IE",
    "IM",
    "IL",
    "IT",
    "JM",
    "JP",
    "JE",
    "JO",
    "KZ",
    "KE",
    "KI",
    "KW",
    "KG",
    "LA",
    "LV",
    "LB",
    "LS",
    "LR",
    "LY",
    "LI",
    "LT",
    "LU",
    "MK",
    "MG",
    "MW",
    "MY",
    "MV",
    "ML",
    "MT",
    "MH",
    "MR",
    "MU",
    "MX",
    "FM",
    "MD",
    "MC",
    "MN",
    "ME",
    "MS",
    "MA",
    "MZ",
    "MM",
    "NA",
    "NP",
    "NL",
    "NZ",
    "NI",
    "NE",
    "NG",
    "KP",
    "NO",
    "OM",
    "PK",
    "PW",
    "PS",
    "PA",
    "PG",
    "PY",
    "PE",
    "PH",
    "PL",
    "PT",
    "QA",
    "XK",
    "RO",
    "RU",
    "RW",
    "SH",
    "KN",
    "LC",
    "VC",
    "WS",
    "SM",
    "ST",
    "SA",
    "SN",
    "RS",
    "SC",
    "SL",
    "SG",
    "SK",
    "SI",
    "SB",
    "SO",
    "ZA",
    "GS",
    "KR",
    "SS",
    "ES",
    "LK",
    "SD",
    "SR",
    "SZ",
    "SE",
    "CH",
    "SY",
    "TW",
    "TJ",
    "TZ",
    "TH",
    "TL",
    "TG",
    "TK",
    "TO",
    "TT",
    "TN",
    "TR",
    "TM",
    "TC",
    "TV",
    "UG",
    "UA",
    "AE",
    "GB",
    "US",
    "UY",
    "UZ",
    "VU",
    "VE",
    "VN",
    "EH",
    "YE",
    "ZM",
    "ZW"
  ]
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
    .domain(data.data.map(function(d) { return d.country; })) //max score 100
    .padding(.1);    

  svg2.append("g")
    .call(d3.axisLeft(y));



  ///////////////////////////////////////////////////////////////////////////////////////////
  // append the bar rectangles to the svg element
  svg2.selectAll("myRect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.country); })
    .attr("width", function(d) { return x(d.score); })
    .attr("height", y.bandwidth())
    .attr("text", "test text yeahiii")
    .style("fill", "#69b3a2")

});