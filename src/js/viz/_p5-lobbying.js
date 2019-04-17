import * as d3 from 'd3';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender } from './utils';


const csv = `\
year,min_spent,max_spent
2001,1180000,3489842
2002,805000,2104923
2003,1110000,2489922
2004,1290000,2624943
2005,1725000,3349932
2006,1150000,2364947
2007,1690000,3514923
2008,2070000,4229916
2009,2490000,5074881
2010,2620000,5094893
2011,3385000,6494878
2012,4000000,7304877
2013,4210000,7729862
2014,4845000,8419867
2015,4135000,7499866
2016,4395000,7414888
2017,5375000,9329859
2018,5235000,8869876
`;


export default responsiveRender(() => {
  const margin = { top: 30, right: 0, bottom: 30, left: 0 };

  const svg = d3.select('#lobbying');

  if (svg.empty()) {
    return;
  }

  svg.selectAll('*').remove();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const width = getWidth(svg.node().parentNode);
  const innerWidth = width - margin.left - margin.right;
  const labelWidth = 20;
  const height = 300;
  const innerHeight = height - margin.top - margin.bottom;

  svg.attr('width', width).attr('height', height);

  const data = d3.csvParse(csv, row => Object.assign({}, {
    year: row.year,
    min_spent: +row.min_spent / 1000000,
    max_spent: +row.max_spent / 1000000,
  }));

  const x = d3.scaleBand()
    .rangeRound([0 + labelWidth, innerWidth])
    .padding(0.2)
    .paddingOuter(0.1)
    .domain(data.map(d => d.year));
  const y = d3.scaleLinear()
    .rangeRound([innerHeight, 0])
    // .domain([0, d3.max(data, d => d.healthy + d.fragile)]);
    .domain([0, d3.max(data, d => d.max_spent)]);

  const xAxis = d3.axisBottom(x)
    .tickFormat((v) => {
      if (width < 325) {
        return (Number(v) % 4) - 2 === 0 ? v : '';
      } else if (width < 550) {
        return `${v.slice(2)}`;
      }
      return v;
    })
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
    .attr('transform', `translate(${labelWidth - 3}, 0)`)
    .call(yAxisLabels)
    .select('.domain')
      .remove();

  // Bars
  g.selectAll('.bar.max-spent')
    .data(data)
    .enter().append('rect')
      .attr('fill', '#fae7ba')
      .attr('class', 'bar max-spent')
      .attr('x', d => x(d.year))
      .attr('y', d => y(d.max_spent))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.max_spent));
  g.selectAll('.bar.min-spent')
    .data(data)
    .enter().append('rect')
      .attr('fill', CATEGORICAL_COLORS[0])
      .attr('class', 'bar min-spent')
      .attr('x', d => x(d.year))
      .attr('y', d => y(d.min_spent))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.min_spent));

  // Chart subheds
  svg.append('text')
    .attr('x', 0)
    .attr('y', 45)
    .attr('class', 'axis')
    .text('In millions');
  svg.append('text')
    .text('Lobbying spending')
    .attr('x', 0)
    .attr('y', 30)
    .attr('font-size', 14)
    .attr('font-weight', 'bold');

  // Legend
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(38, 70)');
  legend.append('rect')
    .attr('width', 15)
    .attr('height', 21)
    .attr('fill', '#fae7ba');
  legend.append('text')
    .attr('font-size', '1.1rem')
    .attr('color', '#333')
    .attr('x', 20)
    .attr('y', 16)
    .text('Maximum spent');
  legend.append('rect')
    .attr('width', 15)
    .attr('height', 21)
    .attr('y', 21)
    .attr('fill', CATEGORICAL_COLORS[0]);
  legend.append('text')
    .attr('font-size', '1.1rem')
    .attr('color', '#333')
    .attr('x', 20)
    .attr('y', 36)
    .text('Minimum spent');
});
