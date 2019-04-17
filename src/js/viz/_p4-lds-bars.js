import * as d3 from 'd3';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender } from './utils';


const rawData = `\
stage,Superior,United,Amerigroup,Cigna,Molina
1,40457500,10500,14874000,28914000,17950000
2,19903000,1500,7120000,9328500,4257500
3,5791000,0,1889750,2546000,1451500`;


export default responsiveRender(() => {
  const margin = { top: 30, right: 0, bottom: 15, left: 0 };

  const svg = d3.select('#ld-reductions');

  if (svg.empty()) {
    return;
  }

  const data = d3.csvParse(rawData, d => Object.assign({}, d, {
    Superior: +d.Superior,
    United: +d.United,
    Amerigroup: +d.Amerigroup,
    Cigna: +d.Cigna,
    Molina: +d.Molina,
    total: (+d.Superior + +d.United + +d.Amerigroup + +d.Cigna + +d.Molina) / 1000000,
  }));

  svg.selectAll('*').remove();

  const wrapper = svg.node().parentNode;
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const width = getWidth(wrapper);
  const innerWidth = width - margin.left - margin.right;
  const labelWidth = 40;
  const captionHeight = 45;
  const height = Math.max(width * 0.6, 325);
  const innerHeight = height - margin.top - margin.bottom;

  svg.attr('width', width).attr('height', height);

  const x = d3.scaleBand()
    .rangeRound([0 + labelWidth, innerWidth])
    .padding(0.2)
    .domain(data.map(d => d.stage));
  const yDollars = d3.scaleLinear()
    .rangeRound([innerHeight, captionHeight])
    .domain([0, d3.max(data, d => d.total)]);


  const xAxis = d3.axisBottom(x)
    .tickSizeOuter(0)
    .tickSizeInner(0)
    .tickFormat(() => '');
  const yDollarsAxisTicks = d3.axisRight(yDollars)
    .ticks(5)
    .tickSizeInner(innerWidth);
  const yDollarsAxisLabels = d3.axisLeft(yDollars)
    .ticks(5)
    .tickSize(0, 0)
    .tickFormat(d3.format('$,'));

  // X axis ticks, labels
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'axis x')
    .call(xAxis);

  // Y axis ticks
  g.append('g')
    .attr('class', 'y-ticks')
    .attr('class', 'tick-lines')
    .attr('transform', `translate(${labelWidth}, 0)`)
    .call(yDollarsAxisTicks)
    .select('.domain')
      .remove();

  // Y axis labels
  g.append('g')
    .attr('class', 'y-labels')
    .attr('class', 'axis')
    .attr('transform', `translate(${labelWidth - 8}, 0)`)
    .call(yDollarsAxisLabels)
    .select('.domain')
      .remove();

  // Bars
  g.selectAll('.bar')
    .data(data)
    .enter().append('rect')
      .attr('fill', CATEGORICAL_COLORS[0])
      .attr('class', 'bar')
      .attr('x', d => x(d.stage))
      .attr('y', d => yDollars(d.total))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - yDollars(d.total));

  // Bar labels
  const stage1x = x('1') + (x.bandwidth() / 2);
  g.append('text')
    .attr('class', 'bar-label')
    .attr('text-anchor', 'middle')
    .attr('x', stage1x)
    .attr('y', yDollars(101) - captionHeight)
    .append('tspan')
    .text('Regulars')
    .attr('x', stage1x)
    .attr('dy', 0)
    .append('tspan')
    .text('recommended')
    .attr('x', stage1x)
    .attr('dy', 16)
    .append('tspan')
    .text('$102 million')
    .attr('font-weight', 'bold')
    .attr('x', stage1x)
    .attr('dy', 16);

  const stage2x = x('2') + (x.bandwidth() / 2);
  const stage2y = yDollars(40.6) - captionHeight;
  const imgSize = window.innerWidth > 500 ? x.bandwidth() * 0.6 : x.bandwidth();
  g.append('image')
    .attr('xlink:href', 'images/forcemugs/g_abbott-600.png')
    .attr('x', stage2x - (imgSize / 2))
    .attr('y', stage2y - (imgSize / 2) - captionHeight - 10)
    .attr('height', imgSize)
    .attr('width', imgSize);
  g.append('text')
    .attr('class', 'bar-label')
    .attr('text-anchor', 'middle')
    .attr('x', stage2x)
    .attr('y', stage2y)
    .append('tspan')
    .text('Commissioner')
    .attr('x', stage2x)
    .attr('dy', 0)
    .append('tspan')
    .text('approved')
    .attr('x', stage2x)
    .attr('dy', 16)
    .append('tspan')
    .text('$41 million')
    .attr('font-weight', 'bold')
    .attr('x', stage2x)
    .attr('dy', 16);

  // Chart subheds
  svg.append('text')
    .attr('x', 0)
    .attr('y', 20 + captionHeight)
    .attr('class', 'axis')
    .text(window.innerWidth > 500 ? 'In millions' : 'Millions');
});
