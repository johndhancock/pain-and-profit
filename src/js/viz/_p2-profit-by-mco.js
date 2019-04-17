import * as d3 from 'd3';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender } from './utils';


export default responsiveRender(() => {
  const margin = { top: 58, bottom: 25 };

  const svg = d3.select('#appeals-by-mco');

  if (svg.empty()) {
    return;
  }

  const wrapper = svg.node().parentNode;

  svg.selectAll('*').remove();

  const width = getWidth(wrapper);
  const labelWidth = 80;
  const innerWidth = (width / 2) - (labelWidth / 2);
  const height = Math.max(width * 0.35, 250);
  const innerHeight = height - margin.top - margin.bottom;

  const gAppeals = svg.append('g')
    .attr('transform', `translate(0, ${margin.top})`);
  const gRate = svg.append('g')
    .attr('transform', `translate(${innerWidth + labelWidth}, ${margin.top})`);

  svg.attr('width', width).attr('height', height);

  const data = [
    { mco: 'Amerigroup', net_per: 746, appeals: 5.7 },
    { mco: 'Cigna', net_per: 476, appeals: 6.2 },
    { mco: 'United', net_per: 252, appeals: 7.7 },
    { mco: 'Molina', net_per: 63, appeals: 11.8 },
    { mco: 'Superior', net_per: 72, appeals: 19.9 },
  ];

  const xAppeals = d3.scaleLinear()
    .rangeRound([0, innerWidth])
    .domain([d3.max(data, d => d.appeals), 0]);
  const xRate = d3.scaleLinear()
    .rangeRound([0, innerWidth])
    .domain([0, d3.max(data, d => d.net_per)]);

  const y = d3.scaleBand()
    .rangeRound([0, innerHeight])
    .padding(0.2)
    .domain(data.map(d => d.mco));

  const numTicks = window.outerWidth > 500 ? 5 : 3;

  const xAppealsAxisTicks = d3.axisTop(xAppeals)
    .ticks(numTicks)
    .tickFormat(d => '')
    .tickSizeInner(innerHeight);
  const xAppealsAxisLabels = d3.axisBottom(xAppeals)
    .tickSize(0, 0)
    .ticks(numTicks);
  const xRateAxisTicks = d3.axisTop(xRate)
    .ticks(numTicks)
    .tickFormat(d => '')
    .tickSizeInner(innerHeight);
  const xRateAxisLabels = d3.axisBottom(xRate)
    .tickSize(0, 0)
    .ticks(numTicks)
    .tickFormat(d3.format('$'));


  // X axis ticks
  gAppeals.append('g')
    .attr('class', 'y-ticks')
    .attr('class', 'tick-lines')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAppealsAxisTicks)
    .select('.domain')
      .remove();
  gRate.append('g')
    .attr('class', 'y-ticks')
    .attr('class', 'tick-lines')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xRateAxisTicks)
    .select('.domain')
      .remove();

  // X axis labels
  gAppeals.append('g')
    .attr('class', 'y-labels')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAppealsAxisLabels)
    .select('.domain')
      .remove();
  gRate.append('g')
    .attr('class', 'y-labels')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xRateAxisLabels)
    .select('.domain')
      .remove();


  // Y axis note
  // gAppeals.append('g')
  //   .attr('transform', 'translate(20, -15)')
  //   .attr('class', 'axis')
  //     .append('text')
  //     .text('Appeals');
  // gRate.append('g')
  //   .attr('transform', 'translate(20, -15)')
  //   .attr('class', 'axis')
  //     .append('text')
  //     .text('Profit rate');

  // Bars
  gAppeals.selectAll('.bar')
    .data(data)
    .enter().append('rect')
      .attr('fill', CATEGORICAL_COLORS[0])
      .attr('class', 'bar')
      .attr('x', d => xAppeals(d.appeals))
      .attr('y', d => y(d.mco))
      .attr('width', d => innerWidth - xAppeals(d.appeals))
      .attr('height', y.bandwidth());
  gRate.selectAll('.bar')
    .data(data)
    .enter().append('rect')
      .attr('fill', CATEGORICAL_COLORS[0])
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.mco))
      .attr('width', d => xRate(d.net_per))
      .attr('height', y.bandwidth());

  // Chart subheds
  svg.append('text')
    .text(window.innerWidth > 500 ? 'Member appeals' : 'Appeals')
    .attr('text-anchor', 'end')
    .attr('x', innerWidth)
    .attr('y', 35)
    .attr('font-size', 14)
    .attr('font-weight', 'bold');
  svg.append('text')
    .attr('text-anchor', 'end')
    .attr('x', innerWidth)
    .attr('y', 50)
    .attr('class', 'axis')
    .text(window.innerWidth > 500 ? 'Annual, per 1,000 patients' : 'Annual, per 1k');
  svg.append('text')
    .text('Profit')
    .attr('x', labelWidth + innerWidth)
    .attr('y', 35)
    .attr('font-size', 14)
    .attr('font-weight', 'bold');
  svg.append('text')
    .attr('x', labelWidth + innerWidth)
    .attr('y', 50)
    .attr('class', 'axis')
    .text('Annual, per patient');

  // Y axis ticks, labels
  const gLabels = svg.append('g')
    .attr('transform', `translate(${innerWidth}, ${margin.top})`)
    .attr('class', 'axis x');

  gLabels.selectAll('line.left-tick')
    .data(data)
    .enter().append('line')
      .attr('class', 'left-tick')
      .attr('y1', d => y(d.mco) + (y.bandwidth() / 2))
      .attr('y2', d => y(d.mco) + (y.bandwidth() / 2))
      .attr('x1', 0)
      .attr('x2', 5);
  gLabels.selectAll('line.right-tick')
    .data(data)
    .enter().append('line')
      .attr('class', 'right-tick')
      .attr('y1', d => y(d.mco) + (y.bandwidth() / 2))
      .attr('y2', d => y(d.mco) + (y.bandwidth() / 2))
      .attr('x1', labelWidth - 5)
      .attr('x2', labelWidth);

  gLabels.selectAll('text')
    .data(data)
    .enter().append('text')
      .text(d => d.mco)
      .attr('y', d => y(d.mco) + (y.bandwidth() / 2) + 3)
      .attr('x', labelWidth / 2)
      .attr('text-anchor', 'middle');

  gAppeals.append('line')
    .attr('class', 'axis x')
    .attr('x1', innerWidth)
    .attr('x2', innerWidth)
    .attr('y1', 0)
    .attr('y2', innerHeight);

  gRate.append('line')
    .attr('class', 'axis x')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', innerHeight);
});
