import d3 from 'd3';
import * as topojson from 'topojson';

const BaseUrl = '/graphs-data/physicians-california/';
const numberFormat = d3.format(',.0f');

const renderMap = (data) => {
  const width = 500;
  const height = 450;

  const projection = d3.geo.mercator()
    .scale(1000 * 2)
    .center([-120, 37.5])
    .translate([width / 2, height / 2]);

  const path = d3.geo.path()
    .projection(projection);

  const svg = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height);

  const getColor = (d) => {
    const value = Math.log(d.properties.value + 1) / 7;
    const l = 0.95 - (Math.min(value, 1) * 0.7);
    return d3.hsl(330, 0.67, l);
  };

  // Draw main map
  d3.json(`${BaseUrl}map-california.json`, (error, ca) => {
    // prepare data
    ca.objects.subunits.geometries.forEach((o) => {
      const name = o.properties.name;
      o.properties.value = data[name] || 0;
    });

    svg.append('path')
      .datum(topojson.feature(ca, ca.objects.subunits))
      .attr('class', 'land')
      .attr('d', path);

    // tooltop declaration
    const div = d3.select('#tooltip-container').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // bind feature data to the map
    svg.selectAll('.subunit')
      .data(topojson.feature(ca, ca.objects.subunits).features)
      .enter().append('path')
      .attr('class', (d) => `subunit ${d.properties.name}`)
      .attr('d', path)
      .attr('fill', getColor)
      .on('mouseover', (d) => { // tooltip
        div.transition()
          .duration(200)
          .style('opacity', 0.9);
        div.html(`${d.properties.fullName}: ${numberFormat(d.properties.value)} Physicians`)
          .style('left', (d3.event.pageX) + 30 + 'px')
          .style('top', (d3.event.pageY - 50) + 'px');
      })
      .on('mouseout', () => {
        div.transition()
          .duration(500)
          .style('opacity', 0.0);
      });

    // exterior border
    svg.append('path')
      .datum(topojson.mesh(ca, ca.objects.subunits, (a, b) => (a === b)))
      .attr('d', path)
      .attr('class', 'exterior-boundary');
  });
};

const renderClassification = (inputData) => {
  let data = Object.keys(inputData).map((key) => ({
    classification: key,
    count: inputData[key],
  }));
  data.sort((a, b) => (b.count - a.count));
  data = data.filter((o) => o.classification);


  const chartData = [{
    x: data.map(o => o.classification),
    y: data.map(o => o.count),
    type: 'bar',
  }];
  const layout = {
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
  Plotly.newPlot('classification', chartData, layout, { displayModeBar: false });
};

const renderSpecialization = (inputData) => {
  const noSpecialiation = inputData[''];
  const text = `* There are ${numberFormat(noSpecialiation)} physicians with no specialization`;
  d3.select('#specialization-note').text(text);

  let data = Object.keys(inputData).map(key => ({
    specialization: key,
    count: inputData[key],
  }));
  data.sort((a, b) => (b.count - a.count));
  data = data.filter((o) => o.specialization);


  const chartData = [{
    x: data.map((o) => o.specialization),
    y: data.map((o) => o.count),
    type: 'bar',
  }];
  const layout = {
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
  Plotly.newPlot('specialization', chartData, layout, { displayModeBar: false });
};


const renderGender = (inputData) => {
  const genderTranslation = {
    M: 'Male',
    F: 'Female',
  };

  const data = Object.keys(inputData).map(gender => ({
    gender: genderTranslation[gender],
    count: inputData[gender],
  }));

  const chartData = [{
    labels: data.map((o) => o.gender),
    values: data.map((o) => o.count),
    type: 'pie',
  }];

  const layout = {
    width: 500,
    height: 500,
  };
  Plotly.newPlot('gender', chartData, layout, { displayModeBar: false });
};

const renderTexts = (data) => {
  const date = new Date(data.lastUpdate);
  const dateFormat = d3.time.format('%x');
  d3.select('#last-update').text(dateFormat(date));

  d3.select('#count').text(numberFormat(data.count));
};

const DrawGraph = () => {
  d3.json(`${BaseUrl}data.json`, (data) => {
    renderMap(data.location);
    renderClassification(data.classification);
    renderSpecialization(data.specialization);
    renderGender(data.gender);
    renderTexts(data);
  });
};

export default DrawGraph;
