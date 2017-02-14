import d3 from 'd3';
import * as topojson from 'topojson';

var BaseUrl = '/graphs-data/patents/'
var numberFormat = d3.format(",.0f");

function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

var renderMap = function(data) {
  data = Object.keys(data).map(function(key){
    var o = {
      state: key,
      count: data[key],
    }
    return o;
  });
  var chartData = [{
    type: 'choropleth',
    locationmode: 'USA-states',
    locations: unpack(data, 'state'),
    z: data.map(function(o){return Math.sqrt(o.count)}),
    text: data.map(function(o){return o.state + ': ' + numberFormat(o.count)}),
    hoverinfo: 'text',
    autocolorscale: true,
    showscale: false,
  }];

  var layout = {
    geo:{
      scope: 'usa',
      countrycolor: 'rgb(255, 255, 255)',
      showland: true,
      landcolor: 'rgb(217, 217, 217)',
      showlakes: true,
      lakecolor: 'rgb(255, 255, 255)',
      subunitcolor: 'rgb(255, 255, 255)',
      lonaxis: {},
      lataxis: {}
    },
    width: 1000,
    height: 500,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
  };
  Plotly.plot('map', chartData, layout, {displayModeBar: false,});

}

var renderStatus = function(data) {
  data = Object.keys(data).map(function(key){
    var o = {
      status: key,
      count: data[key],
    }
    return o;
  });

  var chartData = [{
    labels: data.map(function(o){ return o.status }),
    values: data.map(function(o){ return o.count }),
    type: "pie",
  }];
  var layout = {
  }
  Plotly.newPlot('status', chartData, layout,  {displayModeBar: false});

}

var renderYear = function(data) {
  data = Object.keys(data).map(function(key){
    var o = {
      year: key,
      ia: data[key][0],
      total: data[key][1],
    }
    return o;
  });

  var chartData = [
    {
      x: data.map(function(o){return o.year;}),
      y: data.map(function(o){return o.ia;}),
      type: 'scatter'
    },
  ];

  var layout = {
    title: 'Number of Patents with an Iranian American as an Inventor',
    xaxis: {title: 'Year', range: [1979, 2015]},
    yaxis: {title: 'Patents Filed'},
  };

  var chartDataPercentage = [
    {
      x: data.map(function(o){return o.year;}),
      y: data.map(function(o){return o.ia / o.total * 100;}),
      type: 'scatter'
    },
  ];

  var layoutPercentage = {
    title: 'Percentage of Patents with an Iranian American as an Inventor',
    xaxis: {title: 'Year', range: [1979, 2015]},
    yaxis: {title: 'Percentage'},
  };

  Plotly.newPlot('year', chartData, layout, {displayModeBar: false});
  Plotly.newPlot('year-percentage', chartDataPercentage, layoutPercentage, {displayModeBar: false});

}


var renderTexts = function(data) {
  var date = new Date(data.lastUpdate)
  var dateFormat = d3.time.format("%x");
  d3.select("#last-update").text(dateFormat(date));
  d3.select("#count").text(numberFormat(data.count.patents));
}


var DrawGraph = function() {
  d3.json(BaseUrl + 'data.json', (data) => {
    renderMap(data.location);
    renderStatus(data.status);
    renderYear(data.year);
    //renderGender(data.gender);
    renderTexts(data);
  });

}

export {DrawGraph};
