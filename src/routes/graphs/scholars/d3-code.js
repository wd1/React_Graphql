import d3 from 'd3';

var numberFormat = d3.format(",.0f");

var renderMap = function(data) {
  var total = 0;
  data = data.map(function(d){
    var o = {
      ia: d[0],
      total: d[1],
      school_name: d[2],
      lat: d[3],
      lon: d[4],
    }
    o.size = o.ia;
    o.percentage = o.size / o.total * 100;
    total += o.size;
    return o;
  });

  var scale =  Math.sqrt(Math.sqrt(data.length)) * 100;

  var mapData = [{
    type: 'scattergeo',
    locationmode: 'USA-states',
    lat: data.map(function(o){return o.lat}),
    lon: data.map(function(o){return o.lon}),
    hoverinfo: 'text',
    text: data.map(function(o){return o.school_name + ': ' + o.size + ' scholars'}),
    marker: {
        size: data.map(function(o){return Math.sqrt(o.size/total) * scale}),
        opacity: 0.8,
        line: {
            color: 'black',
            width: 1
        },

        color: data.map(function(o){return Math.min(o.percentage, 5)}),
        colorbar: {
          title: 'Percentage of Iranian-<br>American Scholars'
        },
    }
  }];

  var mapLayout = {
      geo: {
          scope: 'usa',
          projection: {
              type: 'albers usa'
          },
          showland: true,
          landcolor: 'rgb(217, 217, 217)',
          subunitwidth: 1,
          countrywidth: 1,
          subunitcolor: 'rgb(255,255,255)',
          countrycolor: 'rgb(255,255,255)'
      },
      autosize: false,
      width: 1200,
      height: 500,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
      },
  };

  Plotly.plot('scholars-map', mapData, mapLayout, {displayModeBar: false});
}

var renderCitations = function(data) {
  var totalCites = 0;
  var totalPopu = 0;
  data = Object.keys(data).map(function(key){
    var o = {
      cite: key,
      popu: data[key],
    }
    totalCites +=  o.cite * o.popu;
    totalPopu += o.popu;
    return o;
  });
  d3.select("#cite-total").text(numberFormat(totalCites));
  d3.select("#cite-avg").text(numberFormat(totalCites / totalPopu));

  var chartData = [{
    x: data.map(function(o){ return o.cite }),
    y: data.map(function(o){ return o.popu }),
    type: "bar",
  }];
  var layout = {
    width: 1000,
    height: 500,
    margin: {
      t: 20,
    },
    yaxis: {
      title: 'Number of Scholars (log. scale)',
      type: 'log',
      range: [-.3, 2.2],
    },
    xaxis: {
      title: 'Number of Citations (log. scale)',
      type: 'log',
      range: [-.3, 4.4],
    },
  };
  Plotly.newPlot('scholars-citations', chartData, layout,  {displayModeBar: false});
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
  Plotly.newPlot('scholars-gender', chartData, layout, {displayModeBar: false});
}

var renderLastUpdate = function(date) {
  date = new Date(date)
  var dateFormat = d3.time.format("%x");
  d3.select("#last-update").text(dateFormat(date));
}


var DrawGraph = function() {
  d3.json('/graphs-data/scholars/data.json', (data) => {
    renderMap(data.location);
    renderCitations(data.citations);
    renderGender(data.gender);
    renderLastUpdate(data.lastUpdate);
  });
}

export {DrawGraph};
