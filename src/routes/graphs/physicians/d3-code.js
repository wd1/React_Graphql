import d3 from 'd3';
import * as topojson from 'topojson';

const BaseUrl = '/graphs-data/physicians/';
const numberFormat = d3.format(',.0f');

const renderMap = (inputData, totalCount, usTopology) => {
  const data = inputData;

  const width = 960;
  const height = 640;
  var centered;
  const textBox = d3.select('#mapText');

  const path = d3.geo.path()
      .projection(null);

  const radius = d3.scale.sqrt()
    .domain([0, 1e3])
    .range([0, 30]);

  const getRadius = (d) => {
    const stateCode = d.properties.abb;
    const population = inputData.state[stateCode] || 0;
    d.population = population;
    return radius(population);
  };

  const color = d3.scale.log().clamp(1)
    .domain([0.1, 1e3])
    .range([0.1, 0.9]);

  const getColor = (d) => {
    const countyCode = d.id;
    const population = inputData.county[countyCode] || 0;
    d.population = population;
    const l = color(population);
    return d3.hsl(330, 0.67, l);
  };

  const mouseover = (d) => {
    textBox.text(`${d.properties.name}: ${numberFormat(d.population)}`);
  }

  const mouseout = () => {
    if (centered) {
      textBox.text(`${centered.properties.name}: ${numberFormat(centered.population)}`);
    } else {
      textBox.text(`Total: ${numberFormat(totalCount)}`);
    }
  }

  const svg = d3.select('#map')
    .append('div')
    .attr('id', 'svgContainer')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin');

  const g = svg.append('g');

  const onClik = (d) => {
    let x;
    let y;
    let k;

    if (!d || centered === d) {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    } else {
      const centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 2.5;
      centered = d;
    }

    g.selectAll('path')
      .classed('active', (dd) => (centered && (dd === centered)));

    g.selectAll('path')
      .classed('active', (dd) => (centered && (dd === centered)));


    g.transition()
      .duration(750)
      .attr('transform', `translate(${width / 2}, ${height / 2})scale(${k})translate(${-x}, ${-y})`)
      .style('stroke-width', `${1.5 / k}px`);

    d3.selectAll('.state')
      .transition()
      .duration(750)
      .style('opacity', (dd) => ((centered === dd) ? 0 : 1))
      .attr('class', (dd) => ((centered === dd) ? 'state state-hidden' : 'state'));

    if (centered) {
      d3.selectAll('.bubble')
        .transition()
        .duration(750)
        .style('opacity', (dd) => ((dd.id === centered.id) ? 0 : 1));
    } else {
      d3.selectAll('.bubble')
        .transition()
        .duration(750)
        .style('opacity', 1);
    }
  };

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
    .on('click', () => (onClik()))
    .on('mouseover', mouseover)
    .on('mouseout', mouseout);

  // States
  g.append('g')
    .attr('id', 'states')
    .selectAll('path')
    .data(topojson.feature(usTopology, usTopology.objects.states).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'state')
    .attr('id', (d) => `state-${d.id}`)
    .attr('r', getRadius)
    .on('click', onClik)
    .on('mouseover', mouseover)
    .on('mouseout', mouseout);

  // States Boarder
  g.append('g')
    .append('path')
    .datum(topojson.mesh(usTopology, usTopology.objects.states, (a, b) => (a !== b)))
    .attr('class', 'border border--state')
    .attr('d', path);

  // Bubbles
  g.append('g')
    .attr('id', 'bubbles')
    .selectAll('circle')
    .data(topojson.feature(usTopology, usTopology.objects.states).features)
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('transform', (d) => `translate(${path.centroid(d)})`)
    .attr('r', getRadius);


  // Graph 2
  const svg2 = d3.select('#map2')
    .append('div')
    .attr('id', 'svgContainer2')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin');

  const g2 = svg2.append('g');
  g2.append('g')
    .attr('id', 'counties2')
    .selectAll('path')
    .data(topojson.feature(usTopology, usTopology.objects.counties).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', getColor)
    .attr('class', 'county2');
};

const renderType = (inputData) => {
  let data = Object.keys(inputData).map((key) => ({
    type: key,
    count: inputData[key],
  }));
  data.sort((a, b) => (b.count - a.count));
  data = data.filter((o) => o.type);

  const chartData = [{
    x: data.map(o => o.type),
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
      title: 'Type of Physicians',
    },
    xaxis: {
      tickangle: 45,
      tickfont: {
        size: 18,
      },
    },
  };
  Plotly.newPlot('type', chartData, layout, { displayModeBar: false });
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
  d3.json(`${BaseUrl}us-counties.json`, (usTopology) => {
    renderMap(data.location, data.count, usTopology);
    renderType(data.type);
    renderClassification(data.classification);
    renderSpecialization(data.specialization);
    renderGender(data.gender);
    renderTexts(data);
  });
  });
};

export default DrawGraph;
