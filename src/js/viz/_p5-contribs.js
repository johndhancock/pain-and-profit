import * as d3 from 'd3';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender } from './utils';


const csv = `\
year,total
2000,26850
2001,15500
2002,73350
2003,56750
2004,99850
2005,43500
2006,140800
2007,56250
2008,226675
2009,128250
2010,322428
2011,118700
2012,390711
2013,58050
2014,394725
2015,117175
2016,378825
2017,102325
`;

export default responsiveRender(() => {
  const svg = d3.select('#contribs');

  if (svg.empty()) {
    return;
  }

  svg.selectAll('*').remove();

  const width = getWidth(svg.node().parentNode);
  const margin = { top: 48, right: 0, bottom: width > 500 ? 30 : 45, left: 0 };
  const innerWidth = width - margin.left - margin.right;
  const labelWidth = 40;
  const height = 300;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  svg.attr('width', width).attr('height', height);

  const data = d3.csvParse(csv, row => Object.assign({}, {
    year: row.year,
    total: +row.total,
  }));
  const biennia = data.map((d, i) => {
    if ((d.year % 2) === 1) return null;

    return Object.assign({}, {
      year: `${d.year.slice(2)}-${data[i + 1].year.slice(2)}`,
      total: d.total + data[i + 1].total,
    });
  }).filter(d => d !== null);

  const x = d3.scaleBand()
    .rangeRound([0 + labelWidth, innerWidth])
    .padding(0.2)
    .domain(biennia.map(d => d.year));
  const y = d3.scaleLinear()
    .rangeRound([innerHeight, 0])
    .domain([0, d3.max(biennia, d => d.total)]);

  const xAxis = d3.axisBottom(x)
    // .tickValues(window.innerWidth < 1100 ? ['2002', '2004', '2006', '2008', '2010', '2012', '2014', '2016', '2018'] : data.map(d => d.year))
    .tickSizeOuter(0);
  const yAxisTicks = d3.axisRight(y)
    .ticks(5)
    .tickSizeInner(innerWidth);
  const yAxisLabels = d3.axisLeft(y)
    .ticks(5)
    .tickSize(0, 0)
    .tickFormat(v => `$${v / 1000}`);

  // X axis ticks, labels
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'axis x')
    .call(xAxis);

  if (width < 500) {
    g.selectAll('.x .tick text')
      .attr('transform', 'translate(17,13) rotate(45)');
  }

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

  // Bars
  g.selectAll('.bar.total-contribs')
    .data(biennia)
    .enter().append('rect')
      .attr('fill', CATEGORICAL_COLORS[0])
      .attr('class', 'bar total-contribs')
      .attr('x', d => x(d.year))
      .attr('y', d => y(d.total))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.total));

  // Chart subheds
  svg.append('text')
    .attr('x', 0)
    .attr('y', 35)
    .attr('class', 'axis')
    .text('In thousands');
  svg.append('text')
    .text('Campaign contributions')
    .attr('x', 0)
    .attr('y', 20)
    .attr('font-size', 14)
    .attr('font-weight', 'bold');
});
