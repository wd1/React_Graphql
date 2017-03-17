import d3 from 'd3';
import * as topojson from 'topojson';

var BaseUrl = '/graphs-data/attorneys/'
var numberFormat = d3.format(",.0f");

var renderMap = function(data) {
  var width = 500;
  var height = 450;

  var projection = d3.geo.mercator()
    .scale(1000 * 2)
    .center([-120, 37.5])
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

  var getColor = function(d) {
    let value = Math.log(d.properties.value + 1) / 6;
    let l = 0.95 - Math.min(value, 1) * 0.7;
    return d3.hsl(330, .67, l);
  }

  // Draw main map
  d3.json(BaseUrl + "map-california.json", function(error, ca) {

    // prepare data
    ca.objects.subunits.geometries.forEach(function(o) {
      let name = o.properties.name;
      o.properties.value = data[name] || 0;
    });

    svg.append("path")
      .datum(topojson.feature(ca, ca.objects.subunits))
      .attr("class", "land")
      .attr("d", path);

    //bind feature data to the map
    svg.selectAll(".subunit")
      .data(topojson.feature(ca, ca.objects.subunits).features)
      .enter().append("path")
      .attr("class", function(d) {return "subunit " + d.properties.name;})
      .attr("d", path)
      .attr("fill", function(d) {return getColor(d);})
      .on("mouseover", function(d) { //tooltip
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.properties.fullName + ': ' + numberFormat(d.properties.value) + ' Attorneys')
          .style("left", (d3.event.pageX) + 30 + "px")
          .style("top", (d3.event.pageY - 50) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0.0);
      });

    //exterior border
    svg.append("path")
      .datum(topojson.mesh(ca, ca.objects.subunits, function(a, b) {
        return a === b;
      }))
      .attr("d", path)
      .attr("class", "exterior-boundary");

    //tooltop declaration
    var div = d3.select("#tooltip-container").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  });
}

var renderAdmissionYear = function(data) {
  data = Object.keys(data).map(function(key){
    var o = {
      year: key,
      ia: data[key][0],
      total: data[key][1],
    }
    return o;
  });


  var chartData = [{
    x: data.map(function(o){ return o.year }),
    y: data.map(function(o){ return o.ia }),
    type: "bar",
  }];
  var layout = {
    title: 'Iranian American Attorneys Admitted to CAlBAR / Year',
    yaxis: {
      title: 'Number of Attorneys',
    },
    xaxis: {
      title: 'Year',
      range: [1960, 2017],
    },
  };
  Plotly.newPlot('admission-year', chartData, layout,  {displayModeBar: false});


  var chartDataPercentage = [{
    x: data.map(function(o){ return o.year }),
    y: data.map(function(o){ return o.ia / o.total * 100 }),
    type: "scatter",
  }];
  var layoutPercentage = {
    title: 'Percentage of Iranian American Admitted / Year',
    yaxis: {
      title: 'Percentage',
    },
    xaxis: {
      title: 'Year',
      range: [1960, 2017],
    },
  };
  Plotly.newPlot('admission-year-percentage', chartDataPercentage, layoutPercentage,  {displayModeBar: false});
}

var renderGender = function(data) {
  var genderTranslation = {
    'm': 'Male',
    'f': 'Female',
    'u': 'Unknown',
  };

  data = Object.keys(data).map(function(gender){
    return {
      gender: genderTranslation[gender],
      count: data[gender],
    };
  });

  var chartData = [{
    labels: data.map(function(o){ return o.gender; }),
    values: data.map(function(o){ return o.count}),
    type: 'pie'
  }];

  var layout = {
    width: 600,
    height: 600,
  };
  Plotly.newPlot('gender', chartData, layout, {displayModeBar: false});
}

var renderStatus = function(data) {
  data = Object.keys(data).map(function(key){
    return {
      key: key,
      value: data[key],
    };
  });

  var chartData = [{
    labels: data.map(function(o){ return o.key; }),
    values: data.map(function(o){ return o.value}),
    type: 'pie'
  }];

  var layout = {
    width: 550,
    height: 550,
  };
  Plotly.newPlot('status', chartData, layout, {displayModeBar: false});
}

var renderLawSchool = function(data) {
  data = Object.keys(data).map(function(key){
    return {
      key: key,
      value: data[key],
    };
  });

  var chartData = [{
    labels: data.map(function(o){ return o.key; }),
    values: data.map(function(o){ return o.value}),
    type: 'pie'
  }];

  var layout = {
    width: 1200,
    height: 600,
  };
  Plotly.newPlot('law-school', chartData, layout, {displayModeBar: false});
}

var renderUndergradSchool = function(data) {
  data = Object.keys(data).map(function(key){
    return {
      key: key,
      value: data[key],
    };
  });

  var chartData = [{
    labels: data.map(function(o){ return o.key; }),
    values: data.map(function(o){ return o.value}),
    type: 'pie'
  }];

  var layout = {
    width: 1200,
    height: 600,
  };
  Plotly.newPlot('undergrad-school', chartData, layout, {displayModeBar: false});
}

var renderTexts = function(data) {
  var date = new Date(data.lastUpdate)
  var dateFormat = d3.time.format("%x");
  d3.select("#last-update").text(dateFormat(date));

  d3.select("#count").text(numberFormat(data.count));
}


var DrawGraph = function() {
  d3.json(BaseUrl + 'data.json', (data) => {
    renderMap(data.location);
    renderAdmissionYear(data.admission);
    renderGender(data.gender);
    renderStatus(data.status);
    renderLawSchool(data.lawSchool);
    renderUndergradSchool(data.undergradSchool);
    renderTexts(data);
  });

}

export {DrawGraph};
