import * as d3 from 'd3';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender } from './utils';


const rawData = `\
start_date,mms,denial_complaints,per_mm,fragile
2008-07-01,2029469,82,0.4040,1
2009-07-01,2291569,151,0.6589,1
2010-07-01,2371678,184,0.7758,1
2011-07-01,3037996,163,0.5365,1
2012-07-01,1878790,102,0.5429,1
2013-07-01,7831840,768,0.9806,1
2014-07-01,5317937,521,0.9797,1
2015-07-01,6846400,667,0.9742,1
2016-07-01,6829214,818,1.1978,1
2017-07-01,6732717,701,1.0412,1
2008-07-01,18950554,228,0.1203,0
2009-07-01,20458421,329,0.1608,0
2010-07-01,23161962,411,0.1774,0
2011-07-01,25358603,330,0.1301,0
2012-07-01,14007196,176,0.1256,0
2013-07-01,56841323,1481,0.2615,0
2014-07-01,37559138,880,0.2343,0
2015-07-01,39792019,806,0.2026,0
2016-07-01,40221373,741,0.1842,0
2017-07-01,40931544,716,0.1749,0
`;

export default responsiveRender(() => {
  const svg = d3.select('#comp-chart');

  if (svg.empty()) {
    return;
  }

  svg.selectAll('*').remove();

  const wrapper = svg.node().parentNode;
  const g = svg.append('g');

  const margin = { top: 35, right: 0, bottom: 30, left: 0 };

  const width = getWidth(wrapper);
  const innerWidth = width - margin.left - margin.right;
  const labelWidth = 30;
  const height = Math.max(width * 0.6, 325);
  const innerHeight = height - margin.top - margin.bottom;

  svg.attr('width', width).attr('height', height);
  g.attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleTime().rangeRound([labelWidth, innerWidth]);
  const y = d3.scaleLinear().rangeRound([innerHeight, 0]);
  const z = d3.scaleOrdinal(CATEGORICAL_COLORS);

  const xAxis = d3.axisBottom(x).tickSizeOuter(0).ticks(d3.timeYear.every(2));
  const yAxisTicks = d3.axisRight(y).tickSizeInner(innerWidth);
  const yAxisLabels = d3.axisLeft(y).tickSize(0, 0);

  const parseDate = d3.timeParse('%Y-%m-%d');

  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.rate));

  const data = d3.csvParse(rawData, row => Object.assign({}, row, {
    date: parseDate(row.start_date),
    rate: (+row.denial_complaints / +row.mms) * 12 * 1000,
    population: +row.fragile === 1 ? 'Fragile' : 'Non-fragile',
  }));

  const byPopulation = d3.nest().key(d => d.population).entries(data);

  x.domain(d3.extent(data, d => d.date));
  y.domain([0, d3.max(data, d => d.rate)]);
  z.domain(d3.extent(byPopulation, d => d.key));

  // X axis ticks, labels
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'axis')
    .call(xAxis);

  // Y axis ticks
  g.append('g')
    .attr('class', 'tick-lines')
    .attr('transform', `translate(${labelWidth}, 0)`)
    .call(yAxisTicks)
    .select('.domain')
      .remove();

  // Y axis labels
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${labelWidth - 8}, 0)`)
    .call(yAxisLabels)
    .select('.domain')
      .remove();

  // Y axis note
  svg.append('g')
    .attr('transform', 'translate(0, 25)')
    .attr('class', 'axis')
      .append('text')
      .text('Per 1,000 members per year');

  // Lines
  const population = g.selectAll('.population')
    .data(byPopulation)
    .enter()
      .append('g')
      .attr('class', 'population');

  population.append('path')
    .attr('fill', 'none')
    .attr('stroke', d => z(d.key))
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 3)
    .attr('d', d => line(d.values));
});
