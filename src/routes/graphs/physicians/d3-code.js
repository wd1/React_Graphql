import d3 from 'd3';
import * as topojson from 'topojson';

var BaseUrl = '/graphs-data/physicians/'
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
    let value = Math.log(d.properties.value + 1) / 7;
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
        div.html(d.properties.fullName + ': ' + numberFormat(d.properties.value) + ' Physicians')
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

var renderClassification = function(data) {
  data = Object.keys(data).map(function(key){
    var o = {
      classification: key,
      count: data[key],
    }
    return o;
  });
  data.sort(function(a,b) {return (b.count - a.count);} );
  data = data.filter(function(o){return o.classification})


  var chartData = [{
    x: data.map(function(o){ return o.classification }),
    y: data.map(function(o){ return o.count }),
    type: "bar",
  }];
  var layout = {
    margin: {
      b: 150,
      r: 100,
      t: 20,
    },
    yaxis: {
      title: 'Number of Physicians',
    },
    xaxis: {
      tickangle: 45,
      tickfont: {
        size: 18,
      },
    },
  };
  Plotly.newPlot('classification', chartData, layout,  {displayModeBar: false});

}

var renderSpecialization = function(data) {
  var noSpecialiation = data[''];
  var text = '* There are ' + numberFormat(noSpecialiation) + ' physicians with no specialization'
  d3.select("#specialization-note").text(text);

  data = Object.keys(data).map(function(key){
    var o = {
      specialization: key,
      count: data[key],
    }
    return o;
  });
  data.sort(function(a,b) {return (b.count - a.count);} );
  data = data.filter(function(o){return o.specialization})


  var chartData = [{
    x: data.map(function(o){ return o.specialization }),
    y: data.map(function(o){ return o.count }),
    type: "bar",
  }];
  var layout = {
    margin: {
      b: 150,
      r: 100,
      t: 20,
    },
    yaxis: {
      title: 'Number of Physicians',
    },
    xaxis: {
      tickangle: 45,
      tickfont: {
        size: 18,
      },
    },
  };
  Plotly.newPlot('specialization', chartData, layout,  {displayModeBar: false});
}


var renderGender = function(data) {
  var genderTranslation = {
    'M': 'Male',
    'F': 'Female',
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
    width: 500,
    height: 500,
  };
  Plotly.newPlot('gender', chartData, layout, {displayModeBar: false});
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
    renderClassification(data.classification);
    renderSpecialization(data.specialization);
    renderGender(data.gender);
    renderTexts(data);
  });

}

export {DrawGraph};
