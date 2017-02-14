// -*- mode: react; -*-
import d3 from 'd3';

var BaseUrl = '/graphs-data/linkedin/'
var numberFormat = d3.format(",.0f");
var percentageFormat = d3.format(",.2f");

var FILTERS = {};
var UPDATES = {};

UPDATES.from_gender = () => {
  UPDATES.map();
  //UPDATES.treemap();
};

UPDATES.from_map = () => {
  UPDATES.gender();
  //UPDATES.treemap();
};

const filterDataMap = (filters, linkedinData) => {
  var mapData = {};
  ['HI', 'AK', 'FL', 'SC', 'GA', 'AL', 'NC', 'TN', 'RI', 'CT', 'MA',
    'ME', 'NH', 'VT', 'NY', 'NJ', 'PA', 'DE', 'MD', 'WV', 'KY', 'OH',
    'MI', 'WY', 'MT', 'ID', 'WA', 'DC', 'TX', 'CA', 'AZ', 'NV', 'UT',
    'CO', 'NM', 'OR', 'ND', 'SD', 'NE', 'IA', 'MS', 'IN', 'IL', 'MN',
    'WI', 'MO', 'AR', 'OK', 'KS', 'LA', 'VA',
  ]
    .forEach((d) => {
      mapData[d] = 0;
    });
  var grandTotalStates = 0;
  var industries = Object.keys(linkedinData);
  industries.forEach((industry) => {
    var industryData = linkedinData[industry];
    var states = Object.keys(industryData);
    states.forEach((state) => {
      if (state == "null") return;
      var stateData = industryData[state];
      let count = 0;
      let genders;
      if ('gender' in filters) {
        if (!(filters.gender in stateData)) return;
        genders = [filters.gender];
      } else {
        genders = Object.keys(stateData);
      }
      genders.forEach((gender) => {
        count += stateData[gender];
      });
      mapData[state] += count;
      grandTotalStates += count;
    });
  });

  // louisiana translate
  mapData['LS'] = mapData['LA'];
  delete mapData['LA'];
  return [mapData, grandTotalStates];
};

const drawMap = (usTopology, linkedinData) => {
  const width = 960;
  const height = 640;

  let [mapData, grandTotalStates] = filterDataMap(FILTERS, linkedinData);
  const max = Math.max(...Object.keys(mapData)
                       .map((key) => mapData[key] || 0));

  const toolTip = (d, n) => {/* function to create html content string in tooltip div. */
    var nFormatted = percentageFormat(n);
    return `<strong>${d.n}</strong> ${nFormatted}%`;
  };

  function mouseOver(d) {
    d3.select("#usmap-tooltip")
      .transition()
      .duration(200)
      .style('opacity', 0.9);

    d3.select("#usmap-tooltip")
      .html(toolTip(d, mapData[d.id]/grandTotalStates*100))
      .style('left', `${d3.event.pageX}px`)
      .style('top', `${d3.event.pageY - 28}px`);

    FILTERS.state = d.id;
    UPDATES.from_map();
  }

  function mouseOut() {
    d3.select("#usmap-tooltip")
      .transition()
      .duration(500)
      .style('opacity', 0);
    delete FILTERS.state;
    UPDATES.from_map();
  }

  function getColor(p) {
    return d3.interpolateLab('#ffffcc', '#800026')(Math.log(p + 1) / (Math.log(max - 0.01)));
  }

  d3.select("#usmap")
    .append('div')
    .attr('id', 'svgContainer')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin')
    .selectAll('.state')
    .data(usTopology)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', (d) => d.d)
    .style('fill', (d) => getColor(mapData[d.id]))
    .on('mouseover', mouseOver)
    .on('mouseout', mouseOut);

  function update() {
    [mapData, grandTotalStates] = filterDataMap(FILTERS, linkedinData);

    d3.select("#usmap")
      .selectAll('.state')
      .transition()
      .duration(200)
      .style('fill', (d) => getColor(mapData[d.id]));
  }

  UPDATES.map = update;
};


const filterDataGender = (filters, linkedinData) => {
  const genderData = {
    m: 0,
    f: 0,
    u: 0,
  };
  const industries = Object.keys(linkedinData);
  industries.forEach((industry) => {
    const industryData = linkedinData[industry];
    let states;
    if ('state' in filters) {
      if (!(filters.state in industryData)) return;
      states = [filters.state];
    } else {
      states = Object.keys(industryData);
    }
    states.forEach((state) => {
      const stateData = industryData[state];
      const genders = Object.keys(stateData);
      genders.forEach((gender) => {
        genderData[gender] += stateData[gender];
      });
    });
  });

  const data = [{
    id: 'm',
    title: 'Male',
    value: genderData.m || 0,
    color: '#3FB8AF',
  }, {
    id: 'u',
    title: 'Unknown',
    value: genderData.u || 0,
    color: '#ecf0f1',
  }, {
    id: 'f',
    title: 'Female',
    value: genderData.f || 0,
    color: '#FF3D7F',
  }];

  let total = 0;
  data.forEach(v => total += v.value);
  data.forEach(v => v.percent = v.value/total);

  return data;
};

const drawGender = (linkedinData) => {
  const width = 960;
  const height = 760;
  const radius = Math.min(width, height) / 2;

  const pie = d3.layout.pie()
                .sort(null)
                .value((d) => d.value);

  const arc = d3.svg.arc()
                .outerRadius(radius * 0.65)
                .innerRadius(radius * 0.35);

  const outerArc = d3.svg.arc()
                     .innerRadius(radius * 0.75)
                     .outerRadius(radius * 0.75);

  const svg = d3.select("#gender-pie")
                .append('svg')
                .attr('viewBox', `0 0 ${width} ${height}`)
                .attr('preserveAspectRatio', 'xMinYMin')
                .append('g');

  svg.append('g').attr('class', 'slices');
  svg.append('g').attr('class', 'labels');
  svg.append('g').attr('class', 'lines');

  svg.attr('transform', `translate(${width / 2},${height / 2})`);

  const key = (d) => d.data.id;

  const mouseOver = (d) => {
    FILTERS.gender = d.data.id;
    UPDATES.from_gender();
  };

  const mouseOut = () => {
    delete FILTERS.gender;
    UPDATES.from_gender();
  };

  var data = filterDataGender(FILTERS, linkedinData);
  const update = () => {
    var newdata = filterDataGender(FILTERS, linkedinData);
    data.forEach( (x, i) => {
      x.value = newdata[i].value;
      x.percent = newdata[i].percent;
    });
    /* ------- PIE SLICES -------*/
    const slice = svg.select('.slices')
                     .selectAll('path.slice')
                     .data(pie(data), key);

    slice.enter()
         .insert('path')
         .style('fill', (d) => d.data.color)
         .on('mouseover', mouseOver)
         .on('mouseout', mouseOut)
         .attr('class', 'slice');

    slice
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return (t) => arc(interpolate(t));
      });

    slice.exit().remove();

    /* ------- TEXT LABELS -------*/

    const text = svg.select('.labels')
                    .selectAll('g')
                    .data(pie(data), key);

    const textg = text.enter()
                      .append('g');

    textg.append('text')
         .attr('dy', '.35em')
         .text((d) => d.data.title);

    const population = textg.append('text')
                            .attr('dy', '1.85em')
                            .attr('class', 'population');

    text.selectAll('.population')
        .transition()
        .tween('text', function (d) {
          var node = this;
          var start = this._current || d;
          start = start.data.percent * 100;
          var end = d.data.percent * 100;
          var i = d3.interpolate(start, end);
          return function (t) {
            d3.select(node)
              .text(percentageFormat(i(t)) + '%');
          };
        });

    const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

    text.transition()
        .duration(500)
        .attrTween('transform', function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = (radius * 0.9) * (midAngle(d2) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
          };
        })
        .styleTween('text-anchor', function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            const d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? 'start' : 'end';
          };
        });

    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    const polyline = svg.select('.lines')
                        .selectAll('polyline')
                        .data(pie(data), key);

    polyline.enter()
            .append('polyline');

    polyline.transition()
            .duration(1000)
            .attrTween('points', function (d) {
              this._current = this._current || d;
              const interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return (t) => {
                const d2 = interpolate(t);
                const pos = outerArc.centroid(d2);
                pos[0] = radius * 0.85 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
              };
            });

    polyline.exit()
            .remove();
  };

  UPDATES.gender = update;
  update();
};

const filterDataTreemap = (filters, linkedinData) => {
  const treemapData = {};

  const industries = Object.keys(linkedinData);
  industries.forEach((industry) => {
    treemapData[industry] = 0;
    const industryData = linkedinData[industry];
    const states = Object.keys(industryData);
    if ('state' in filters) {
      const stateData = industryData[filters.state];
      let count = 0;
      const genders = Object.keys(stateData);
      genders.forEach((gender) => {
        count += stateData[gender];
      });
      treemapData[industry] += count;
    } else {
      states.forEach((state) => {
        const stateData = industryData[state];
        let count = 0;
        const genders = Object.keys(stateData);
        genders.forEach((gender) => {
          count += stateData[gender];
        });
        treemapData[industry] += count;
      });
    }
  });
  return treemapData;
};

const drawTreemap = (root, linkedinData) => {
  const margin = {
    top: 20,
    right: 0,
    bottom: 0,
    left: 0,
  };
  const width = 960;
  const height = 500 - margin.top - margin.bottom;
  const formatNumber = d3.format(',d');
  let transitioning;

  const x = d3.scale.linear()
              .domain([0, width])
              .range([0, width]);

  const y = d3.scale.linear()
              .domain([0, height])
              .range([0, height]);

  const initialize = (root) => {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
    return root;
  };

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when when layout is computed.
  const accumulate = (d, treemapData) => {
    if (d.children) {
      d._children = d.children;
      d.value = d.children.reduce((p, v) => p + accumulate(v, treemapData), 0)
      return d.value;
    } else {
      d.value = treemapData[d.name] || 0;
      return d.value;
    }
  };

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  const layout = (d, treemap) => {
    if (d._children) {
      treemap.nodes({
        _children: d._children,
      });
      d._children.forEach((c) => {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c, treemap);
      });
    }
  };

  const text = (text) => {
    text.attr('x', (d) => x(d.x) + 6)
        .attr('y', (d) => y(d.y) + 6);
  };

  const colorScheme = d3.interpolate('#029789', '#ee8100');

  const rect = (rect) => {
    rect.attr('x', (d) => x(d.x))
        .attr('y', (d) => y(d.y))
        .attr('width', (d) => x(d.x + d.dx) - x(d.x))
        .attr('height', (d) => y(d.y + d.dy) - y(d.y))
        .style("fill", function(d) {return colorScheme(d.value / root.value * 10);})
  };

  const name = (d) => {
    return d.parent ?
           `${name(d.parent)}.${d.name}` :
           d.name;
  };

  const display = (d, grandparent, svg, status) => {
    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      let g2 = display(d, grandparent, svg),
          t1 = g1.transition()
                 .duration(750),
          t2 = g2.transition()
                 .duration(750);

      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      svg.style('shape-rendering', null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll('.depth')
         .sort((a, b) => a.depth - b.depth);

      // Fade-in entering text.
      g2.selectAll('text')
        .style('fill-opacity', 0);

      // Transition to the new view.
      t1.selectAll('text')
        .call(text)
        .style('fill-opacity', 0);
      t2.selectAll('text')
        .call(text)
        .style('fill-opacity', 1);
      t1.selectAll('rect')
        .call(rect);
      t2.selectAll('rect')
        .call(rect);

      // Remove the old node when the transition is finished.
      t1.remove()
        .each('end', () => {
          svg.style('shape-rendering', 'crispEdges');
          transitioning = false;
        });
    }

    if (status) {
      transition(d);
    }

    grandparent
      .datum(d.parent)
      .on('click', transition)
      .select('text')
      .text(name(d));

    const g1 = svg.insert('g', '.grandparent')
                  .datum(d)
                  .attr('class', 'depth');

    const g = g1.selectAll('g')
                .data(d._children)
                .enter()
                .append('g');

    g.filter((d) => d._children)
     .classed('children', true)
     .on('click', transition);

    g.selectAll('.child')
     .data((d) => d._children || [d])
     .enter()
     .append('rect')
     .attr('class', 'child')
     .call(rect);

    g.append('rect')
     .attr('class', 'parent')
     .call(rect)
     .append('title')
     .text((d) => formatNumber(d.value));

    g.append('text')
     .attr('dy', '.75em')
     .text((d) => d.name + ': '+ percentageFormat(d.value / root.value * 100) + '%')
     .call(text);

    return g;
  };

  const update = (status = true) => {
    const treemap = d3.layout.treemap()
                      .children((d, depth) => depth ? null : d._children)
                      .sort((a, b) => a.value - b.value)
                      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
                      .round(false);

    const svg = d3.select("#treemap")
                  .append('svg')
                  .attr('class', 'svgtreemap')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.bottom + margin.top)
                  .style('margin-left', `${-margin.left}px`)
                  .style('margin.right', `${-margin.right}px`)
                  .append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`)
                  .style('shape-rendering', 'crispEdges');


    const grandparent = svg.append('g')
                           .attr('class', 'grandparent');

    grandparent.append('rect')
               .attr('y', -margin.top)
               .attr('width', width)
               .attr('height', margin.top);

    grandparent.append('text')
               .attr('x', 6)
               .attr('y', 6 - margin.top)
               .attr('dy', '.75em');

    /* const iFILTERS = {state: "CA"};*/
    const treemapData = filterDataTreemap(FILTERS, linkedinData);
    const xroot = initialize(root);
    accumulate(xroot, treemapData);
    layout(xroot, treemap);
    display(xroot, grandparent, svg, status);
  };

  UPDATES.treemap = update;

  update(false);
};

const renderTexts = function(data) {
  var date = new Date(data.lastUpdate)
  var dateFormat = d3.time.format("%x");
  d3.select("#last-update").text(dateFormat(date));

  d3.select("#count").text(numberFormat(data.count));
}

const DrawGraph = function () {
  d3.json(BaseUrl + 'usmap.json', (usTopology) => {
  d3.json(BaseUrl + 'flare.json', (flare) => {
  d3.json(BaseUrl + 'linkedin-data.json', (data) => {
    drawMap(usTopology, data.details);
    drawGender(data.details);
    drawTreemap(flare, data.details);
    renderTexts(data);
  });
  });
  });
};

export {
  DrawGraph,
};
