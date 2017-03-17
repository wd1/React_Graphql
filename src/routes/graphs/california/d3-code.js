// -*- mode: react; -*-
import d3 from 'd3';
import * as topojson from 'topojson';

var numberFormat = d3.format("0,000");

var DrawGraph = function() {
  let width = 400;
  let height = 600;
  const mapElm = this.map;
  const explanationElm = this.explanation;
  const sequenceElm = this.sequence;

  const projection = d3.geo.mercator()
                       .scale(1000 * 2)
                       .center([-120, 37])
                       .translate([width / 2, height / 2]);

  const path = d3.geo.path()
                 .projection(projection);

  const svg = d3.select(mapElm)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

  const getColor = (d, node) => {
    try {
      d.properties.ia = node.counties[d.properties.name].ia;
      d.properties.total = node.counties[d.properties.name].total;
    } catch (e) {
      d.properties.ia = 0;
      d.properties.total = 0;
    }
    d.properties.iaPercentage = (d.properties.ia / d.properties.total) || 0;

    const l = 0.9 - Math.min(d.properties.iaPercentage / 0.01, 1) * 0.7;
    return d3.hsl(330, 0.67, l);
  };

  // Color Map
  // Note: input dictionary must contain names of all 58 counties
  const reColorMap = (node) => {
    d3.selectAll('.subunit')
      .attr('fill', (d) =>
        getColor(d, node),
      );
  };

  // Draw main map
  d3.json('/graphs-data/california/map-california.json', (error, ca) => {
    // slugify county names in the map data structure
    ca.objects.subunits.geometries.forEach((o) => {
      o.properties.name = o.properties.name.split(' ')
                           .join('-')
                           .toLowerCase();
    });

    svg.append('path')
       .datum(topojson.feature(ca, ca.objects.subunits))
       .attr('class', 'land')
       .attr('d', path);

    // bind feature data to the map
    svg.selectAll('.subunit')
       .data(topojson.feature(ca, ca.objects.subunits)
                     .features)
       .enter()
       .append('path')
       .attr('class', (d) => `subunit ${d.properties.name}`)
       .attr('d', path)
       .on('mouseover', (d) => { // tooltip
         div.transition()
            .duration(200)
            .style('opacity', 0.9);
         div.html(
           `${d.properties.fullName}: ${numberFormat(d.properties.ia)} is IA`,
         )
            .style('left', `${(d3.event.pageX) + 10}px`)
            .style('top', `${d3.event.pageY - 30}px`);
       })
       .on('mouseout', (d) => {
         div.transition()
            .duration(500)
            .style('opacity', 0.0);
       });

    // exterior border
    svg.append('path')
       .datum(topojson.mesh(ca, ca.objects.subunits, (a, b) =>
         a === b,
       ))
       .attr('d', path)
       .attr('class', 'exterior-boundary');

    // tooltop declaration
    let div = d3.select(mapElm)
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
  });

  // Dimensions of sunburst.
  width = 750;
  const widthSequence = 1050;
  height = 600;
  const radius = Math.min(width, height) / 2;

  // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
  const b = {
    w: 250,
    h: 30,
    s: 3,
    t: 10,
  };

  // Mapping of step names to colors.
  const colors = d3.scale.category20b();
  const full_name = function (o) {
    if (!o) return '';
    let parentName = full_name(o.parent);
    if (parentName && parentName != 'root') {
      parentName += '/';
    } else {
      parentName = '';
    }
    return parentName + o.name;
  };

  const get_color = function (o) {
    const percentage = o.ia / o.total;
    const l = 0.9 - Math.min(percentage * 100, 1) * 0.7; // between 0.9 and 0.3 depending on percentage
    return d3.hsl(135, 0.64, l);
  };

  const unslugifyFileds = function (s) {
    s = s.split('-')
         .join(' ');
    if (s === 'null') s = 'unclassified';
    if (s === 'root') s = '';
    return s;
  };

  // Total size of all segments; we set this later, after loading the data.
  let totalSize = 0;

  const doughnut = this.doughnut;

  const vis = d3.select(doughnut)
                .append('svg:svg')
                .attr('width', width)
                .attr('height', height)
                .append('svg:g')
                .attr('id', 'container')
                .attr('transform', `translate(${width / 2},${height / 2})`);

  const partition = d3.layout.partition()
                      .size([2 * Math.PI, radius * radius])
                      .value((d) => d.total);

  const arc = d3.svg.arc()
                .startAngle((d) => d.x)
                .endAngle((d) => d.x + d.dx)
                .innerRadius((d) => Math.sqrt(d.y))
                .outerRadius((d) => Math.sqrt(d.y + d.dy));

  let ROOT;


  function initializeBreadcrumbTrail() {
    // Add the svg area.
    const trail = d3.select(sequenceElm)
                    .append('svg:svg')
                    .attr('width', widthSequence)
                    .attr('height', 50)
                    .attr('id', 'trail');
    // Add the label at the end, for the percentage.
    trail.append('svg:text')
         .attr('id', 'endlabel')
         .style('fill', '#000');
  }

  // Generate a string that describes the points of a breadcrumb polygon.
  function breadcrumbPoints(d, i) {
    const points = [];
    points.push('0,0');
    points.push(`${b.w},0`);
    points.push(`${b.w + b.t},${b.h / 2}`);
    points.push(`${b.w},${b.h}`);
    points.push(`0,${b.h}`);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
      points.push(`${b.t},${b.h / 2}`);
    }
    return points.join(' ');
  }

  // Update the breadcrumb trail to show the current sequence and percentage.
  function updateBreadcrumbs(nodeArray, percentageString) {
    // Data join; key function combines name and depth (= position in sequence).
    const g = d3.select('#trail')
                .selectAll('g')
                .data(nodeArray, (d) => d.name + d.depth);

    // Add breadcrumb and label for entering nodes.
    const entering = g.enter()
                      .append('svg:g');

    entering.append('svg:polygon')
            .attr('points', breadcrumbPoints)
            .style('fill', (d) => get_color(d));

    entering.append('svg:text')
            .attr('x', (b.w + b.t) / 2)
            .attr('y', b.h / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .text((d) => unslugifyFileds(d.name));

    // Set position for entering and updating nodes.
    g.attr('transform', (d, i) => `translate(${i * (b.w + b.s)}, 0)`);

    // Remove exiting nodes.
    g.exit()
     .remove();

    // Now move and update the percentage at the end.
    d3.select('#trail')
      .select('#endlabel')
      .attr('x', (nodeArray.length + 0.5) * (b.w + b.s))
      .attr('y', b.h / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(percentageString);

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select('#trail')
      .style('visibility', '');
  }

  const sumObject = function (o, k) {
    return Object.keys(o)
                 .reduce((a, b) => a + o[b][k], 0);
  };
  const sumChildrenCounties = function (children) {
    const result = {};
    for (const i in children) {
      const child = children[i];
      const counties = child.counties;
      for (const county in counties) {
        if (!(county in result)) {
          result[county] = {
            total: 0,
            ia: 0,
          };
        }
        result[county].total += counties[county].total;
        result[county].ia += counties[county].ia;
      }
    }
    return result;
  };

  const populate_middle_nodes = function (o) {
    if ('total' in o) return;
    if ('children' in o) {
      o.children.forEach(populate_middle_nodes);
      o.counties = sumChildrenCounties(o.children),
      o.total = sumObject(o.counties, 'total');
      o.ia = sumObject(o.counties, 'ia');
    }
  };

  // Take a 2-column CSV and transform it into a hierarchical structure suitable
  // for a partition layout. The first column is a sequence of step names, from
  // root to leaf, separated by hyphens. The second column is a count of how
  // often that sequence occurred.
  function buildHierarchy(data) {
    const root = {
      name: 'root',
      children: [],
    };
    for (const i in data) {
      const sequence = i;
      const row = data[i];

      const parts = sequence.split('.');
      let currentNode = root;
      for (let j = 0; j < parts.length; j++) {
        const children = currentNode.children;
        const nodeName = parts[j];
        let childNode;
        if (j + 1 < parts.length) {
          // Not yet at the end of the sequence; move down the tree.
          let foundChild = false;
          for (let k = 0; k < children.length; k++) {
            if (children[k].name == nodeName) {
              childNode = children[k];
              foundChild = true;
              break;
            }
          }
          // If we don't already have a child node for this branch, create it.
          if (!foundChild) {
            childNode = {
              name: nodeName,
              children: [],
            };
            children.push(childNode);
          }
          currentNode = childNode;
        } else {
          // Reached the end of the sequence; create a leaf node.
          childNode = {
            name: nodeName,
            counties: row,
            total: sumObject(row, 'total'),
            ia: sumObject(row, 'ia'),
          };
          children.push(childNode);
        }
      }
    }
    populate_middle_nodes(root);
    return root;
  }

  // Main function to draw and set up the visualization, once we have the data.
  function createVisualization(tree) {
    // Basic setup of page elements.
    initializeBreadcrumbTrail();

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append('svg:circle')
       .attr('r', radius)
       .style('opacity', 0);

    // For efficiency, filter nodes to keep only those large enough to see.
    const nodes = partition.nodes(tree)
                           .filter((d) =>
                             // return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
                             true);

    reColorMap(ROOT);

    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
    function getAncestors(node) {
      const aPath = [];
      let current = node;
      while (current.parent) {
        aPath.unshift(current);
        current = current.parent;
      }
      return aPath;
    }

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {
      const totalPercentage = (100 * d.total / totalSize)
        .toPrecision(3);
      const iaPercentage = (100 * d.ia / d.total)
        .toPrecision(3);
      const breadcrumbsString = `${iaPercentage}% are Iranian American`;

      d3.select('#center-name')
        .text(unslugifyFileds(d.name));
      d3.select('#center-total')
        .text(numberFormat(d.total));
      d3.select('#center-ia')
        .text(numberFormat(d.ia));

      d3.select(explanationElm)
        .style('visibility', '');

      reColorMap(d);

      if (d != ROOT) {
        const sequenceArray = getAncestors(d);
        updateBreadcrumbs(sequenceArray, breadcrumbsString);

        // Fade all the segments.
        vis.selectAll('path')
           .style('opacity', 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        vis.selectAll('path')
           .filter((node) => (sequenceArray.indexOf(node) >= 0))
           .style('opacity', 1);
      }
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {
      // Hide the breadcrumb trail
      d3.select('#trail')
        .style('visibility', 'hidden');

      // Deactivate all segments during transition.
      vis.selectAll('path')
         .on('mouseover', null);

      // Transition each segment to full opacity and then reactivate it.
      vis.selectAll('path')
         .transition()
         .duration(100)
         .style('opacity', 1)
         .each('end', function () {
           d3.select(this)
             .on('mouseover', mouseover);
         });

      d3.select(explanationElm)
        .style('visibility', 'hidden');

      mouseover(ROOT);
    }

    // stop mouse over and mouse leave events.
    function mouseclick(d) {
      if (d.mouseclick) {
        d3.select(doughnut)
                                             .selectAll('path')
                                             .on('mouseover', mouseover);
        d3.select('#container')
                                             .on('mouseleave', mouseleave);
        d3.select('#container')
                                             .on('click', null);
        d.mouseclick = false;
      } else {
        d.mouseclick = true;
        d3.select(doughnut)
                                             .selectAll('path')
                                             .on('mouseover', null);
        d3.select('#container')
                                             .on('mouseleave', null);
        d3.select('#container')
                                             .on('click', () => {
                                               mouseclick(d);
                                             });
      }
    }

    const path = vis.data([tree])
                    .selectAll('path')
                    .data(nodes)
                    .enter()
                    .append('svg:path')
                    .attr('display', (d) => d.depth ? null : 'none')
                    .attr('d', arc)
                    .attr('fill-rule', 'evenodd')
                    .style('fill', (d) => get_color(d))
                    .style('opacity', 1)
                    .on('mouseover', mouseover)
                    .on('dblclick', mouseclick);

    /* path.append("svg:text")
           .attr("transform", function(d) { return "rotate(" + (d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180 + ")"; })
           .attr("x", function(d) { return Math.sqrt(d.y); })
           .attr("dx", "6") // margin
       .attr("dy", ".35em") // vertical-align
       .text(function(d) { return d.name; });*/

    // Add the mouseleave handler to the bounding circle.
    d3.select('#container')
      .on('mouseleave', mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.node()
                                                                               .__data__.value;
  }

  // Use d3.text and d3.csv.parseRows so that we do not need to have a header
  // row, and can receive the csv as an array of arrays.
  d3.json('/graphs-data/california/data.json', (data) => {
    const tree = buildHierarchy(data);
    ROOT = tree;
    createVisualization(tree);
  });
};

export {DrawGraph};
