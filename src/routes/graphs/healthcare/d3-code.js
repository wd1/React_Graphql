import d3 from 'd3';
import * as topojson from 'topojson';

const BaseUrl = '/graphs-data/healthcare/';
const numberFormat = d3.format(',.0f');

const capitalizeFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const renderMap = (inputData, totalCount, usTopology) => {
  const width = 960;
  const height = 640;
  const textBox1 = d3.select('#mapText1');
  const textBox2 = d3.select('#mapText2');

  const statesDataMap = {};
  usTopology.objects.states.geometries.forEach(x => { statesDataMap[x.id] = x.properties; });

  const path = d3.geo.path()
      .projection(null);

  const color = d3.scale.log().clamp(1)
    .domain([0.1, 1e3])
    .range([0.1, 0.9]);

  const getColor = (d) => {
    const countyCode = d.id;
    const stateCode = countyCode.substring(0, 2);
    const state = statesDataMap[stateCode];
    const population = inputData.county[countyCode] || 0;
    d.population = population;
    d.state = state;
    d.statePopulation = inputData.state[state.abb] || 0;
    const l = color(population);
    return d3.hsl(330, 0.67, l);
  };

  const mouseover = (d) => {
    textBox1.text(`${d.state.name}: ${numberFormat(d.statePopulation)}`);
    textBox2.text(`${d.properties.name}: ${numberFormat(d.population)}`);
  };

  const mouseout = () => {
    textBox1.text(`Total: ${numberFormat(totalCount)}`);
    textBox2.text('select a county from the map');
  };

  const svg = d3.select('#map')
    .append('div')
    .attr('id', 'svgContainer')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin');

  const g = svg.append('g');

  // Counties
  g.append('g')
    .attr('id', 'counties')
    .selectAll('path')
    .data(topojson.feature(usTopology, usTopology.objects.counties).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', getColor)
    .attr('class', 'county')
    .on('mouseover', mouseover)
    .on('mouseout', mouseout);
};

const renderType = (inputData) => {
  let data = Object.keys(inputData).map((key) => ({
    type: key,
    count: inputData[key],
  }));
  data.sort((a, b) => (b.count - a.count));
  data = data.filter((o) => o.type);

  const chartData = [{
    labels: data.map(o => o.type),
    values: data.map(o => o.count),
    type: 'pie',
  }];
  const layout = {
    width: 500,
    height: 500,
    legend: {
      x: 0,
      y: 500,
    },
  };

  if (document.getElementById('type') !== null) {
    Plotly.newPlot('type', chartData, layout, { displayModeBar: false });
  }
};

const renderClassification = (inputData, category) => {
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
      title: `Number of ${capitalizeFirstLetter(category)}`,
    },
    xaxis: {
      tickangle: 45,
      tickfont: {
        size: 18,
      },
    },
  };

  if (document.getElementById('classification') !== null) {
    Plotly.newPlot('classification', chartData, layout, { displayModeBar: false });
  }
};

const renderSpecialization = (inputData, category) => {
  const noSpecialiation = inputData[''];
  const text = `* There are ${numberFormat(noSpecialiation)} ${category} with no specialization`;
  noSpecialiation && d3.select('#specialization-note').text(text);

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
      title: `Number of ${capitalizeFirstLetter(category)}`,
    },
    xaxis: {
      tickangle: 45,
      tickfont: {
        size: 18,
      },
    },
  };

  if (document.getElementById('specialization') !== null) {
    Plotly.newPlot('specialization', chartData, layout, { displayModeBar: false });
  }
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
    legend: {
      x: 0,
      y: 500,
    },
  };
  Plotly.newPlot('gender', chartData, layout, { displayModeBar: false });
};

const renderTexts = (data) => {
  const date = new Date(data.lastUpdate);
  const dateFormat = d3.time.format('%x');
  d3.select('#last-update').text(dateFormat(date));

  d3.select('#count').text(numberFormat(data.count));
};

const DrawGraph = (category) => {
  d3.json(`${BaseUrl}data-${category}.json`, (data) => {
  d3.json(`${BaseUrl}us-counties.json`, (usTopology) => {
    renderMap(data.location, data.count, usTopology);
    renderType(data.type);
    renderClassification(data.classification, category);
    renderSpecialization(data.specialization, category);
    renderGender(data.gender);
    renderTexts(data);
  });
  });
};

export default DrawGraph;
