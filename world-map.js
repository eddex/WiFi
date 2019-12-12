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
  .attr("id", "world-map")
  ;

/* encryption_data is a list of objects with a 'wep' and a 'count' attribute
   * wep can be one of: 3, 2, W, Y, N, ?
   * 3 = WPA3
   * 2 = WPA2
   * W = WPA
   * Y = WEP
   * N = not encrypted
   * ? = unknown
   */
function getCountryEncryptionStats(encryption_data) {

  const encryption_names = {
    '3':'WPA3',
    '2':'WPA2',
    'W':'WPA',
    'Y':'WEP',
    'N':'None',
    '?':'Unknown'
  };
  const secure_protocols = [
    encryption_names['3'],
    encryption_names['2'],
    encryption_names['W']
  ]
  const insecure_protocols = [
    encryption_names['Y'],
    encryption_names['N']
  ]

  let stats = {
    total: 0,
    total_secure: 0,
    total_insecure: 0,
    wpa3: 0,
    wpa2: 0,
    wpa: 0,
    wep: 0,
    none: 0,
    unknown: 0
  }

  for (i = 0; i < encryption_data.length; i++) {
    const encryption = encryption_data[i];
    const encryption_name = encryption_names[encryption.wep];

    if (secure_protocols.includes(encryption_name)) {
      stats.total += encryption.count;
      stats.total_secure += encryption.count;

    } else if (insecure_protocols.includes(encryption_name)) {
      stats.total += encryption.count;
      stats.total_insecure += encryption.count;
    }

    if (encryption_name === 'WPA3') {
      stats.wpa3 = encryption.count
    }
    if (encryption_name === 'WPA2') {
      stats.wpa2 = encryption.count
    }
    if (encryption_name === 'WPA') {
      stats.wpa = encryption.count
    }
    if (encryption_name === 'WEP') {
      stats.wep = encryption.count
    }
    if (encryption_name === 'None') {
      stats.none = encryption.count
    }
    if (encryption_name === 'Unknown') {
      stats.unknown = encryption.count
    }
  }
  return stats;
}

function createPElementFor(name, count) {
  if (count) {
    const p = document.createElement('p');
    p.innerText = name + ': ' + count;
    return p;
  }
}

function createDataForCountryAsHtml(name, encryption_data) {
  const container = document.createElement('div');
  const title = document.createElement('h3');
  title.innerText = name;
  container.append(title);

  const stats = getCountryEncryptionStats(encryption_data);

  const p_score = document.createElement('p');
  p_score.innerText = 'Security Score: ' + (Math.round((stats.total_secure / stats.total - stats.total_insecure / stats.total) * 100) + 100) / 2;
  container.append(p_score);
  console.log(stats)
  container.append(createPElementFor('WPA3', stats.wpa3));
  container.append(createPElementFor('WPA2', stats.wpa2));
  container.append(createPElementFor('WPA', stats.wpa));
  container.append(createPElementFor('WEP', stats.wep));
  container.append(createPElementFor('None', stats.none));

  return container
}

// show the details for a country in the sidebar
function showDataForCountry(iso_a2) {
  console.log(iso_a2 + " clicked")
  fetch('data/stats_regions_' + iso_a2 + '.json')
    .then(data => data.json()
      .then(json => {
        console.log(json);
        const detailsHtml = createDataForCountryAsHtml(json.name, json.encryption);
        $('#country-details').html(detailsHtml);
  }));
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

setTimeout(() => {
  const map = document.getElementById('map');
  const map_height = map.getBBox().height;

  const map_svg = document.getElementById('world-map');
  map_svg.style = 'height: ' + map_height + 'px;';
  const map_container = document.getElementById('map-holder');
  map_container.style = 'height: ' + map_height + 'px;';
}, 700)

