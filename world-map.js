// DEFINE VARIABLES
// Define size of map group
// Full world map is 2:1 ratio
// Using 12:5 because we will crop top and bottom of map
w = $("#map-holder").width();
h = $("#map-holder").width() /12*5;

// DEFINE FUNCTIONS/OBJECTS
// Define map projection
var projection = d3
  .geoEquirectangular()
  .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
  .scale([w / (2 * Math.PI)]) // scale to fit group width
  .translate([w / 2, h / 2]) // ensure centred in group
  ;

// Define map path
var path = d3
  .geoPath()
  .projection(projection)
  ;

function getTextBox(selection) {
  selection
    .each(function (d) {
      d.bbox = this
        .getBBox();
    })
    ;
}

// create an SVG
var svg = d3
  .select("#map-holder")
  .append("svg")
  // set to the same size as the "map-holder" div
  .attr("width", $("#map-holder").width())
  .attr("height", $("#map-holder").height())
  ;

// show the details for a country in the sidebar
function showDataForCountry(iso_a2) {
  // TODO: display details for country in #country-details container
  console.log(iso_a2 + " clicked")
}


// get map data
d3.json(
  "data/world-map.geo.json",
  function (json) {
    //Bind data and create one path per GeoJSON feature
    countriesGroup = svg.append("g").attr("id", "map");
    // add a background rectangle
    countriesGroup
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h);

    // draw a path for each feature/country
    countries = countriesGroup
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function (d, i) {
        return "country" + d.properties.iso_a3;
      })
      .attr("class", "country")
      //      .attr("stroke-width", 10)
      //      .attr("stroke", "#ff0000")
      // add a mouseover action to show name label for feature/country
      .on("mouseover", function (d, i) {
        d3.select("#countryLabel" + d.properties.iso_a3).style("display", "block");
      })
      .on("mouseout", function (d, i) {
        d3.select("#countryLabel" + d.properties.iso_a3).style("display", "none");
      })
      // add an onclick action for the clicked country
      .on("click", function (d, i) {
        d3.selectAll(".country").classed("country-on", false);
        d3.select(this).classed("country-on", true);
        showDataForCountry(d.properties.iso_a2);
      });
    // Add a label group to each feature/country. This will contain the country name and a background rectangle
    // Use CSS to have class "countryLabel" initially hidden
    countryLabels = countriesGroup
      .selectAll("g")
      .data(json.features)
      .enter()
      .append("g")
      .attr("class", "countryLabel")
      .attr("id", function (d) {
        return "countryLabel" + d.properties.iso_a3;
      })
      .attr("transform", function (d) {
        return (
          "translate(" + path.centroid(d)[0] + "," + path.centroid(d)[1] + ")"
        );
      })
      // add mouseover functionality to the label
      .on("mouseover", function (d, i) {
        d3.select(this).style("display", "block");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).style("display", "none");
      })
      // add an onlcick action for the clicked country
      .on("click", function (d, i) {
        d3.selectAll(".country").classed("country-on", false);
        d3.select("#country" + d.properties.iso_a3).classed("country-on", true);
        showDataForCountry(d.properties.iso_a2);
      });
    // add the text to the label group showing country name
    countryLabels
      .append("text")
      .attr("class", "countryName")
      .style("text-anchor", "middle")
      .attr("dx", 0)
      .attr("dy", 0)
      .text(function (d) {
        return d.properties.name;
      })
      .call(getTextBox);
    // add a background rectangle the same size as the text
    countryLabels
      .insert("rect", "text")
      .attr("class", "countryLabelBg")
      .attr("transform", function (d) {
        return "translate(" + (d.bbox.x - 2) + "," + d.bbox.y + ")";
      })
      .attr("width", function (d) {
        return d.bbox.width + 4;
      })
      .attr("height", function (d) {
        return d.bbox.height;
      });
  }
);