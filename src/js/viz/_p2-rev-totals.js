import * as d3 from 'd3';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender } from './utils';


const csv = `\
fiscal,healthy_gross,fragile_gross
2007,2728518471,577693183
2008,3549690072,972511441
2009,3935858210,1182082635
2010,4160940795,1384888196
2011,4585598937,1751100807
2012,2394233580,1007393549
2013,12254909686,6792089796
2014,8513420079,5032401512
2015,8651190852,7574529114
2016,9195324745,9421828112
2017,9339156546,11674517721
`;


export default responsiveRender(() => {
  const margin = { top: 30, right: 0, bottom: 45, left: 0 };

  const svg = d3.select('#revenues');

  if (svg.empty()) {
    return;
  }

  svg.selectAll('*').remove();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const width = getWidth(svg.node().parentNode);
  const innerWidth = width - margin.left - margin.right;
  const labelWidth = 35;
  const height = 300;
  const innerHeight = height - margin.top - margin.bottom;

  svg.attr('width', width).attr('height', height);

  const annualData = d3.csvParse(csv, row => Object.assign({}, {
    fiscal: row.fiscal,
    healthy: +row.healthy_gross / 1000000000,
    fragile: +row.fragile_gross / 1000000000,
  }));

  const data = annualData.map((d, idx) => {
    if (idx % 2 === 0) {
      return null;
    }

    return {
      fiscal: `’${d.fiscal.slice(2)}-’${annualData[idx + 1].fiscal.slice(2)}`,
      healthy: d.healthy + annualData[idx + 1].healthy,
      fragile: d.fragile + annualData[idx + 1].fragile,
    };
  }).filter(d => d !== null);

  const x = d3.scaleBand()
    .rangeRound([0 + labelWidth, innerWidth])
    .padding(0.2)
    .domain(data.map(d => d.fiscal));
  const y = d3.scaleLinear()
    .rangeRound([innerHeight, 0])
    // .domain([0, d3.max(data, d => d.healthy + d.fragile)]);
    .domain([0, d3.max(data, d => d3.max([d.healthy, d.fragile]))]);


  const xAxis = d3.axisBottom(x)
    .tickSizeOuter(0);
  const yAxisTicks = d3.axisRight(y)
    .ticks(5)
    .tickSizeInner(innerWidth);
  const yAxisLabels = d3.axisLeft(y)
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
  // g.selectAll('.bar.fragile')
  //   .data(data)
  //   .enter().append('rect')
  //     .attr('fill', CATEGORICAL_COLORS[0])
  //     .attr('class', 'bar fragile')
  //     .attr('x', d => x(d.fiscal))
  //     .attr('y', d => y(d.fragile))
  //     .attr('width', x.bandwidth())
  //     .attr('height', d => innerHeight - y(d.fragile));
  //
  // g.selectAll('.bar.healthy')
  //   .data(data)
  //   .enter().append('rect')
  //     .attr('fill', CATEGORICAL_COLORS[1])
  //     .attr('class', 'bar healthy')
  //     .attr('x', d => x(d.fiscal))
  //     .attr('y', d => y(d.healthy + d.fragile))
  //     .attr('width', x.bandwidth())
  //     .attr('height', d => innerHeight - y(d.healthy));

  g.selectAll('.bar.fragile')
    .data(data)
    .enter().append('rect')
      .attr('fill', CATEGORICAL_COLORS[0])
      .attr('class', 'bar fragile')
      .attr('x', d => x(d.fiscal))
      .attr('y', d => y(d.fragile))
      .attr('width', x.bandwidth() / 2)
      .attr('height', d => innerHeight - y(d.fragile));

  g.selectAll('.bar.healthy')
    .data(data)
    .enter().append('rect')
      .attr('fill', CATEGORICAL_COLORS[1])
      .attr('class', 'bar healthy')
      .attr('x', d => x(d.fiscal) + (x.bandwidth() / 2))
      .attr('y', d => y(d.healthy))
      .attr('width', x.bandwidth() / 2)
      .attr('height', d => innerHeight - y(d.healthy));

  // Chart subheds
  svg.append('text')
    .attr('x', 0)
    .attr('y', 25)
    .attr('class', 'axis')
    .text('In billions');
});
