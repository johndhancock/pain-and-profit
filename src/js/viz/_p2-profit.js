import * as d3 from 'd3';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender, splitText } from './utils';


export default responsiveRender(() => {
  const margin = { top: 60, right: 0, bottom: 45, left: 0 };

  const leftSvg = d3.select('#profit-chart');
  // TODO: Nuke this right SVG
  // const rightSvg = d3.select('#profit-chart-rate');

  if (leftSvg.empty()) {
    return;
  }

  leftSvg.selectAll('*').remove();
  // rightSvg.selectAll('*').remove();

  const wrapper = leftSvg.node().parentNode;
  const gDollars = leftSvg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  // const gRate = rightSvg.append('g')
  //   .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const width = getWidth(wrapper);
  const innerWidth = width - margin.left - margin.right;
  const labelWidth = 50;
  const height = Math.max(width * 0.6, 325);
  const innerHeight = height - margin.top - margin.bottom;

  leftSvg.attr('width', width).attr('height', height);
  // rightSvg.attr('width', width).attr('height', height);


  const data = [
    { pop: 'Fragile kids', profit: 1028.5, fragile: true, net: 0.057, revenue: 18057 },
    { pop: 'Foster kids', profit: 611.49, fragile: true, net: 0.056, revenue: 10890 },
    { pop: 'Elderly, disabled', profit: 201.27, fragile: true, net: 0.015, revenue: 13734 },
    { pop: 'Healthy people', profit: 182.63, fragile: false, net: 0.064, revenue: 2857 },
  ];


  const x = d3.scaleBand()
    .rangeRound([0 + labelWidth, innerWidth])
    .padding(0.2)
    .domain(data.map(d => d.pop));
  const rightX = d3.scaleBand()
    .rangeRound([0 + labelWidth, innerWidth])
    .padding(0.2)
    .domain(data.map(d => d.pop));
  const yDollars = d3.scaleLinear()
    .rangeRound([innerHeight, 0])
    .domain([0, d3.max(data, d => d.profit)]);
  const yRate = d3.scaleLinear()
    .rangeRound([innerHeight, 0])
    .domain([0, d3.max(data, d => d.revenue)]);
  const z = d3
    .scaleOrdinal(CATEGORICAL_COLORS)
    .domain(data.map(d => d.fragile));


  const xAxis = d3.axisBottom(x)
    .tickSizeOuter(0);
  const rightXaxis = d3.axisBottom(rightX)
    .tickSizeOuter(0);
  const yDollarsAxisTicks = d3.axisRight(yDollars)
    .ticks(5)
    .tickSizeInner(innerWidth);
  const yDollarsAxisLabels = d3.axisLeft(yDollars)
    .ticks(5)
    .tickSize(0, 0)
    .tickFormat(d3.format('$,'));
  const yRateAxisTicks = d3.axisRight(yRate)
    .ticks(5)
    .tickSizeInner(innerWidth);
  const yRateAxisLabels = d3.axisLeft(yRate)
    .tickSize(0, 0)
    .ticks(5)
    .tickFormat(d3.format('$,.2s'));

  // X axis ticks, labels
  gDollars.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'axis x')
    .call(xAxis);
  // gRate.append('g')
  //   .attr('transform', `translate(0, ${innerHeight})`)
  //   .attr('class', 'axis x')
  //   .call(rightXaxis);
  gDollars.selectAll('.axis.x text')
    .call(splitText);
  // gRate.selectAll('.axis.x text')
  //   .call(splitText);


  // Y axis ticks
  gDollars.append('g')
    .attr('class', 'y-ticks')
    .attr('class', 'tick-lines')
    .attr('transform', `translate(${labelWidth}, 0)`)
    .call(yDollarsAxisTicks)
    .select('.domain')
      .remove();
  // gRate.append('g')
  //   .attr('class', 'y-ticks')
  //   .attr('class', 'tick-lines')
  //   .attr('transform', `translate(${labelWidth}, 0)`)
  //   .call(yRateAxisTicks)
  //   .select('.domain')
  //     .remove();

  // Y axis labels
  gDollars.append('g')
    .attr('class', 'y-labels')
    .attr('class', 'axis')
    .attr('transform', `translate(${labelWidth - 8}, 0)`)
    .call(yDollarsAxisLabels)
    .select('.domain')
      .remove();
  // gRate.append('g')
  //   .attr('class', 'y-labels')
  //   .attr('class', 'axis')
  //   .attr('transform', `translate(${labelWidth - 8}, 0)`)
  //   .call(yRateAxisLabels)
  //   .select('.domain')
  //     .remove();

  // Bars
  gDollars.selectAll('.bar')
    .data(data)
    .enter().append('rect')
      .attr('fill', d => z(d.fragile))
      .attr('class', 'bar')
      .attr('x', d => x(d.pop))
      .attr('y', d => yDollars(d.profit))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - yDollars(d.profit));
  // gRate.selectAll('.bar')
  //   .data(data)
  //   .enter().append('rect')
  //     .attr('fill', d => z(d.fragile))
  //     .attr('class', 'bar')
  //     .attr('x', d => rightX(d.pop))
  //     .attr('y', d => yRate(d.revenue))
  //     .attr('width', x.bandwidth())
  //     .attr('height', d => innerHeight - yRate(d.revenue));

  // Chart subheds
  leftSvg.append('text')
    .text('Profit')
    .attr('x', 0)
    .attr('y', 33)
    .attr('font-size', 14)
    .attr('font-weight', 'bold');
  leftSvg.append('text')
    .attr('x', 0)
    .attr('y', 48)
    .attr('class', 'axis')
    .text('Annual, per patient, fiscal years 2014-17');

  // rightSvg.append('text')
  //   .text('Revenue')
  //   .attr('x', 15)
  //   .attr('y', 30)
  //   .attr('font-size', 14)
  //   .attr('font-weight', 'bold');
  // rightSvg.append('text')
  //   .attr('x', 15)
  //   .attr('y', 45)
  //   .attr('class', 'axis')
  //   .text('Annual, per patient');
});
