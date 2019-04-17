/* eslint-disable no-confusing-arrow */
import * as d3 from 'd3';
import range from 'lodash.range';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth, responsiveRender } from './utils';
import chatter from './_p7-appeals-chatter.json';


const txtLength = (tspan) => {
  const spacesLength = (tspan.text().match(' ') || []).length * 4;
  const computedLength = tspan.node().getComputedTextLength();
  return spacesLength + computedLength;
};


// const centerV = (txt, height) => {
//   txt.each(function centerTextV() {
//     const el = d3.select(this);
//
//     const renderedHeight = el.node().getBBox().height;
//     const currentY = el.attr('y');
//     const margin = (height - renderedHeight) / 2;
//
//     txt.selectAll('tspan').each(function centerTspan() {
//       const tspan = d3.select(this);
//       tspan.attr('y', parseFloat(currentY) + margin);
//     });
//   });
// };


const txtBlock = (txt, width, fontSize) => {
  txt.each(function wrapText() {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    const x = text.attr('x');
    const y = text.attr('y');
    const dy = 0;

    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', `${dy}em`);

    let line = [];
    let lineNumber = 0;
    let word;
    do {
      word = words.pop();
      line.push(word);
      tspan.text(line.join(' '));

      if (txtLength(tspan) > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${((lineNumber += 1) * fontSize) + dy}em`)
          .text(word);
      }
    } while (word);
  });
};


export default responsiveRender(() => {
  const svg = d3.select('#walkthrough__appeals svg');

  if (svg.empty()) {
    return;
  }

  svg.selectAll('*').remove();

  const BASELINE = 410;
  const ICON_WIDTH = 200;
  const ICON_HEIGHT = ICON_WIDTH;

  const parentWidth = getWidth(svg.node().parentNode);
  const center = (parentWidth / 2);

  const points = [{ x: 0 }].concat(chatter.walkthroughSteps).map((d, i) => Object.assign({}, {
    i,
    x: center + (Math.max(250, center) * i),
  }, d));

  svg
    .attr('width', parentWidth)
    .attr('height', 400);

  const margins = { left: 30, right: 30 };

  const chartG = svg.append('g')
    .attr('class', 'chart')
    .attr('opacity', 0);
  const markerG = svg.append('g')
    .attr('class', 'marker');
  const pannableLinearG = svg.append('g')
    .attr('class', 'pannable-linear');
  const pannableEasedG = svg.append('g')
    .attr('class', 'pannable-eased');

  // Walking human
  const markerX = center - (ICON_WIDTH / 2);
  const marker = markerG.append('image')
    .attr('width', ICON_WIDTH)
    .attr('height', ICON_HEIGHT)
    .attr('opacity', window.innerWidth > 800 ? 1 : 0)
    .attr('x', markerX)
    .attr('y', BASELINE - (ICON_HEIGHT + 10))
    .attr('xlink:href', 'images/_appeals-walkthrough-man.gif');
  const faceForward = () => {
    marker
      .attr('transform', null)
      .attr('x', center - (ICON_WIDTH / 2));
  };
  const faceBakward = () => {
    marker
      .attr('transform', 'scale(-1, 1)')
      .attr('x', (center * -1) - (ICON_WIDTH / 2));
  };

  // Intro chatter (hed)
  const chatterWidth = parentWidth - margins.left - margins.right;
  const introHed = pannableEasedG.append('text')
    .attr('class', 'chatter h3')
    .attr('x', margins.left)
    .attr('y', 60)
    .text(chatter.hed);
  introHed
    .call(txtBlock, chatterWidth, 1.2);
  // Intro chatter (deck)
  const introChatter = pannableEasedG.append('text')
    .attr('class', 'chatter p')
    .attr('x', margins.left)
    .attr('y', 50 + introHed.node().getBBox().height)
    .text(chatter.intro)
    .call(txtBlock, chatterWidth, 1.4);
  // Intro chatter (call to action)
  const start = pannableEasedG.append('g')
    .style('cursor', 'pointer')
    .attr('opacity', 1);
  const startTxt = start.append('text')
    .attr('class', 'chatter p strong cta')
    .attr('x', margins.left)
    .attr('y', 70 + introHed.node().getBBox().height + introChatter.node().getBBox().height)
    .attr('line-height', '100%')
    .text(chatter.btnTxt);
  start.append('circle')
    .attr('fill', CATEGORICAL_COLORS[0])
    .attr('r', 15)
    .attr('cx', startTxt.node().getBBox().width + 20 + margins.left)
    .attr('cy', startTxt.attr('y') - 5);
  start.append('text')
    .attr('x', startTxt.node().getBBox().width + 21 + margins.left)
    .attr('y', startTxt.attr('y') - 4)
    .attr('font-size', 20)
    .attr('line-height', 20)
    .attr('class', 'fa')
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .text('\uf054');

  // Per-step chatter
  const drawChatter = sel => sel.append('text')
    .attr('class', d => `chatter p chatter-step chatter-step-${d.i}`)
    .attr('x', d => d.x + center)  // eslint-disable-line no-mixed-operators
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text(d => d.txt)
    .call(txtBlock, Math.min(ICON_WIDTH + 75, (parentWidth - margins.left - margins.right)), 1.4);
    // .call(centerV, 120);
  pannableLinearG.selectAll('text.chatter-step.p')
    .data(points.filter(d => d.bg !== undefined))
    .enter().call(drawChatter);
  pannableEasedG.selectAll('text.chatter-step.p')
    .data(points.filter(d => d.bg === undefined))
    .enter().call(drawChatter);

  // Base images
  const bgImgs = pannableEasedG.selectAll('image.step-img')
    .data(points.filter(d => d.bg))
  .enter().append('image')
    .attr('class', d => `step-img step-img-${d.i}`)
    .attr('width', 250)
    .attr('height', 250)
    .attr('x', d => d.x + center + (250 * -0.5))
    .attr('y', 140)
    .attr('xlink:href', d => `images/${d.bg}`);

  // Humans
  const fgImgs = pannableEasedG.selectAll('image.step-img-human')
    .data(points.filter(d => d.fg))
  .enter().append('image')
    .attr('class', 'step-img-human')
    .attr('width', 250)
    .attr('height', 250)
    .attr('x', d => d.x + center + (250 * -0.5))
    .attr('y', 140)
    .attr('opacity', 0)
    .attr('xlink:href', d => `images/${d.fg}`);
  svg.append('image')
    .attr('width', 0)
    .attr('height', 0)
    .attr('xlink:href', 'images/_appeals-walkthrough-doc-agrees.gif');
  const doctor = pannableEasedG.append('image')
    .attr('width', 200)
    .attr('height', 200)
    .attr('x', points[4].x + center + (200 * -0.5) + 30)
    .attr('y', 145)
    .attr('opacity', 0);

  // Continue buttons
  const next = pannableEasedG.selectAll('text.cta.next')
    .data(points.filter(d => d.i !== 0))
  .enter().append('text')
    .attr('class', 'chatter p a cta strong next fa')
    .style('font-size', '2rem')
    .attr('alignment-baseline', 'middle')
    .attr('x', d => d.x + center + (d.bg || d.chart || d.i === 4 ? 131 : 75))
    .attr('y', 275)
    .attr('opacity', 0)
    .text('\uf054');
  const prev = pannableEasedG.selectAll('text.cta.prev')
    .data(points.filter(d => d.i > 1))
  .enter().append('text')
    .attr('class', 'chatter p a cta strong prev fa')
    .style('font-size', '2rem')
    .attr('alignment-baseline', 'middle')
    .attr('x', d => (d.x + center) - (d.bg || d.chart || d.i === 4 ? 143 : 95))
    .attr('y', 275)
    .attr('opacity', 0)
    .text('\uf053');

  // Progress bar
  const progressThickness = 4;
  svg.append('line')
    .attr('class', 'progress-bar-outer')
    .attr('rendering', 'crisp-edges')
    .attr('x1', margins.left)
    .attr('x2', svg.attr('width') - margins.right)
    .attr('y1', 0)
    .attr('y2', 0)
    .attr('stroke', 'black')
    .attr('stroke-width', progressThickness);
  const progress = svg.append('line')
    .attr('class', 'progress-bar-inner')
    .attr('rendering', 'crisp-edges')
    .attr('x1', margins.left)
    .attr('x2', margins.left)
    .attr('y1', 0)
    .attr('y2', 0)
    .attr('stroke', CATEGORICAL_COLORS[0])
    .attr('stroke-width', progressThickness + 1);

  const chartWidth = 220;
  const chartLeftX = center - (chartWidth / 2);
  const boxSize = chartWidth / 10;
  const rowSize = 10;
  const boxMargin = 4;
  const chartGray = '#c9c9c9';

  const chartDataPoints = {
    'withdrawn-favorable': 8,
    'no-show': 51,
    sustained: 21,
    reversed: 20,
  };
  let chartData = [];
  let i = 0;
  Object.entries(chartDataPoints).forEach((_) => {
    chartData = chartData.concat(range(_[1]).map(() => {
      const d = { i, outcome: _[0] };
      i += 1;
      return d;
    }));
  });

  const chart = chartG.selectAll('rect.unit')
    .data(chartData)
  .enter().append('rect')
    .attr('class', 'unit')
    .attr('x', d => (boxMargin / 2) + chartLeftX + ((d.i % rowSize) * boxSize))
    .attr('y', d => (boxMargin / 2) + 150 + (Math.floor(d.i / rowSize) * boxSize))
    .attr('width', boxSize - boxMargin)
    .attr('height', boxSize - boxMargin);

  let currentOffset = 0;
  let currentPoint = 0;
  const goToPoint = (idx) => {
    if (idx === points.length) {
      progress.transition()
        .duration(5000)
        .attr('x2', margins.left);

      pannableEasedG.transition()
        .ease(d3.easeBackInOut)
        .duration(5000)
        .attr('transform', `translate(${points[0].x * -1}, 0)`)
        .on('start', () => {
          faceBakward();

          next
            .transition()
            .duration(500)
            .attr('opacity', 0);
          prev
            .transition()
            .duration(500)
            .attr('opacity', 0);
          bgImgs
            .transition()
            .duration(2000)
            .attr('opacity', 1);
          fgImgs
            .transition()
            .duration(2000)
            .attr('opacity', 1);
        })
        .on('end', () => {
          faceForward();

          start
            .transition()
            .delay(750)
            .duration(500)
            .attr('opacity', 1);

          if (window.innerWidth < 500) {
            marker.transition()
              .delay(750)
              .duration(500)
              .attr('opacity', 0);
          }

          currentOffset = 0;
          currentPoint = 0;
        });

      return;
    }

    const to = points[idx];
    const duration = Math.abs(to.x - currentOffset) * 6;
    const forward = currentOffset <= to.x;

    if (!forward) { faceBakward(); }

    const fadeOut = s => s
      .transition()
      .duration(300)
      .attr('opacity', 0);

    fgImgs
      .call(fadeOut);
    pannableEasedG.selectAll('text.chatter-step.p')
      .call(fadeOut);
    pannableLinearG.selectAll('text.chatter-step.p')
      .call(fadeOut);
    bgImgs
      .call(fadeOut);
    prev
      .call(fadeOut);
    next
      .call(fadeOut);

    const activeOpacity = d => d.i === idx ? 1 : 0;

    pannableEasedG.selectAll('text.chatter-step.p')
      .transition()
      .duration(600)
      .delay(duration / 2)
      .attr('opacity', activeOpacity);
    bgImgs
      .transition()
      .duration(duration * 0.5)
      .delay(duration * 0.25)
      .attr('opacity', activeOpacity);
    progress
      .transition()
      .ease(d3.easeQuadOut)
      .duration(duration)
      .attr('x2', (svg.attr('width') - margins.right) * (idx / (points.length - 1)));

    pannableLinearG.transition()
      .ease(d3.easePolyInOut.exponent(2))
      .duration(duration)
      .attr('transform', `translate(${to.x * -1}, 0)`)
      .on('end', () => {
        fgImgs
          .transition()
          .duration(600)
          .attr('opacity', activeOpacity);
        pannableLinearG.selectAll('text.chatter-step.p')
          .transition()
          .duration(600)
          .attr('opacity', activeOpacity);
        next
          .transition()
          .delay(200)
          .duration(600)
          .attr('opacity', activeOpacity);
        prev
          .transition()
          .delay(200)
          .duration(600)
          .attr('opacity', activeOpacity);

        faceForward();
      });

    pannableEasedG.transition()
      .ease(d3.easePolyInOut.exponent(2))
      .duration(duration)
      .attr('transform', `translate(${to.x * -1}, 0)`);

    chartG.transition().attr('opacity', to.chart ? 1 : 0);
    marker.transition().attr('opacity', to.chart ? 0 : 1);

    const randomDelay = () => forward ? Math.random() * duration * 0.6 : 0;

    if (idx === 4) {
      marker
        .transition()
        .delay(duration)
        .duration(1200)
        .ease(d3.easeBackOut)
        .attr('x', center - 140);
      doctor.transition()
        .attr('xlink:href', 'images/_appeals-walkthrough-doc-agrees.gif')
        .delay(duration)
        .attr('opacity', 1);
    } else if (to.x > currentOffset && (idx === 3 || idx === 5)) {
      doctor.transition()
        .attr('opacity', 0)
        .on('end', () => {
          doctor.attr('xlink:href', null);
        });
      marker
        .transition()
        .duration(duration)
        .attr('x', markerX);
    } else if (idx === 7) {
      chart
        .transition()
        .attr('fill', chartGray);
    } else if (idx === 8) {
      chart
        .transition()
        .delay(duration * 0.8)
        .attr('opacity', 1)
        .attr('fill', d => d.outcome === 'withdrawn-favorable' ? CATEGORICAL_COLORS[0] : chartGray);
    } else if (idx === 9) {
      chart
        .transition()
        .attr('fill', chartGray);
      chart.transition()
        .delay(randomDelay)
        .ease(d3.easeCircleIn)
        .attr('opacity', d => d.outcome === 'withdrawn-favorable' ? 0 : 1);
      chart
        .transition()
        .delay(duration * 0.8)
        .attr('fill', d => d.outcome === 'no-show' ? CATEGORICAL_COLORS[0] : chartGray);
    } else if (idx === 10) {
      chart
        .transition()
        .attr('fill', chartGray);
      chart
        .transition()
        .ease(d3.easeCircleIn)
        .delay(randomDelay)
        .attr('opacity', d => d.outcome === 'withdrawn-favorable' || d.outcome === 'no-show' ? 0 : 1);
      chart
        .transition()
        .delay(duration * 0.8)
        .attr('fill', d => d.outcome === 'sustained' ? CATEGORICAL_COLORS[0] : chartGray);
    } else if (idx === 11) {
      chart
        .transition()
        .attr('fill', chartGray)
        .attr('opacity', d => d.outcome === 'withdrawn-favorable' || d.outcome === 'no-show' ? 0.5 : 1);
      chart
        .transition()
        .delay(duration * 0.8)
        .attr('fill', d => d.outcome === 'reversed' ? CATEGORICAL_COLORS[0] : chartGray);
    }

    currentOffset = to.x;
    currentPoint = idx;
  };

  prev.on('click', () => { goToPoint(currentPoint -= 1); });
  next.on('click', () => { goToPoint(currentPoint += 1); });
  start.on('click', () => {
    start
      .transition()
      .attr('opacity', 0);
    marker
      .transition()
      .duration(1500)
      .attr('opacity', 1);
    goToPoint(1);
  });
});
