import * as d3 from 'd3';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender } from './utils';


const csv = `\
fiscal,program,net_per
2008,STAR,162
2008,STAR+PLUS,-291
2008,STAR Health,-424
2009,STAR,197
2009,STAR+PLUS,-66
2009,STAR Health,-591
2010,STAR,-6
2010,STAR+PLUS,187
2010,STAR Health,-542
2011,STAR,75
2011,STAR+PLUS,-233
2011,STAR Health,349
2012,STAR,6
2012,STAR+PLUS,-303
2012,STAR Health,262
2013,STAR,55
2013,STAR+PLUS,3
2013,STAR Health,632
2014,STAR,336
2014,STAR+PLUS,366
2014,STAR Health,1264
2015,STAR,182
2015,STAR+PLUS,35
2015,STAR Health,661
2016,STAR,145
2016,STAR+PLUS,107
2016,STAR Health,281
2017,STAR,164
2017,STAR+PLUS,-9
2017,STAR Health,357`;


export default responsiveRender(() => {
  const margin = { top: 30, right: 0, bottom: 25, left: 0 };

  const svg = d3.select('#foster-profits');

  if (svg.empty()) {
    return;
  }

  svg.selectAll('*').remove();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const width = getWidth(svg.node().parentNode);
  const innerWidth = width - margin.left - margin.right;
  const labelWidth = 45;
  const height = 300;
  const innerHeight = height - margin.top - margin.bottom;

  svg.attr('width', width).attr('height', height);

  const data = d3.csvParse(csv, row => Object.assign({}, {
    fiscal: row.fiscal,
    program: row.program,
    net: +row.net_per,
  }));
  const nestedData = d3.nest()
    .key(d => d.program)
    .entries(data);

  const x = d3.scalePoint()
    .rangeRound([0 + labelWidth, innerWidth])
    .padding(0.2)
    .domain(data.map(d => d.fiscal));
  const y = d3.scaleLinear()
    .rangeRound([innerHeight, 0])
    .domain([d3.min(data, d => d.net) - 50, d3.max(data, d => d.net)]);

  const xAxisLabels = d3.axisBottom(x)
    .tickFormat(d => `'${d.slice(2)}`)
    .tickSizeOuter(0);
  const yTickValues = [-400, 0, 400, 800, 1200];
  const yAxisTicks = d3.axisRight(y)
    .tickValues(yTickValues)
    .tickSizeInner(innerWidth);
  const yAxisLabels = d3.axisLeft(y)
    .tickValues(yTickValues)
    .tickSize(0, 0)
    .tickFormat(d3.format('$,'));

  // X axis ticks, labels
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'axis x')
    .call(xAxisLabels);
  g.append('g')
    .attr('transform', `translate(${labelWidth}, 0)`)
    .attr('class', 'axis x')
    .append('line')
      .attr('stroke-width', 1)
      .attr('x1', 0)
      .attr('y1', y(0) + 1)
      .attr('x2', innerWidth)
      .attr('y2', y(0) + 1);
  g.append('text')
    .attr('transform', `translate(30, ${innerHeight + 16.5})`)
    .attr('class', 'axis x')
    .text('FY');

  // Y axis ticks
  g.append('g')
    .attr('class', 'y-ticks')
    .attr('class', 'tick-lines')
    .attr('transform', `translate(${labelWidth}, 0)`)
    .call(yAxisTicks)
    .select('.domain')
      .remove();

  // Y axis labels
  g.append('g')
    .attr('class', 'y-labels')
    .attr('class', 'axis')
    .attr('transform', `translate(${labelWidth - 8}, 0)`)
    .call(yAxisLabels)
    .select('.domain')
      .remove();

  // Lines
  const lineGenerator = d3.line()
    .x(d => x(d.fiscal))
    .y(d => y(d.net));
  // eslint-disable-next-line no-confusing-arrow
  const lineColor = (d) => {
    switch (d.key) {
      case 'STAR Health':
        return CATEGORICAL_COLORS[0];
      case 'STAR':
        return CATEGORICAL_COLORS[1];
      default:
        // 'STAR+PLUS'
        return CATEGORICAL_COLORS[2];
    }
  };

  g.selectAll('path.line.profit')
    .data(nestedData)
    .enter()
    .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 3)
      .attr('class', 'line profit')
      .attr('d', d => lineGenerator(d.values));

  // Chart subheds
  svg.append('text')
    .attr('x', 0)
    .attr('y', 22)
    .attr('class', 'axis')
    .text('Annual profit per patient');
});
