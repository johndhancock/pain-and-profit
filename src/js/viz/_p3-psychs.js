import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import $ from 'jquery';

import { CATEGORICAL_COLORS } from '../_colors';
import { getWidth } from './utils';


const render = () => {
  const svg = d3.select('#psychs-map');

  if (svg.empty()) {
    return;
  }

  const aspectRatio = 0.952;
  let width = getWidth(svg.node().parentNode);
  let height = width * aspectRatio;

  svg.attr('width', width)
    .attr('height', height);

  const getProjection = () => d3.geoMercator()
    .scale(width * 4.3)
    .center([-100.1, 31.3])
    .translate([width / 2, height / 2]);
  let projection = getProjection();

  let path = d3.geoPath()
    .projection(projection);

  const g = svg.append('g');

  const roadColor = (d) => {
    return {
      U: '#999',  // U.S.
      I: '#999',  // Interstate
      S: '#c9c9c9',  // State
    }[d];
  };
  const roadWidth = (d) => {
    return {
      U: window.innerWidth > 500 ? 0.3 : 0.45,  // U.S.
      I: window.innerWidth > 500 ? 0.5 : 0.55,  // Interstate
      S: window.innerWidth > 500 ? 0.3 : 0.15,  // State
    }[d];
  };

  const mapLayer = g.append('g')
    .attr('class', 'map-layer');

  const triangle = d3.symbol()
    .type(d3.symbolTriangle)
    .size((d) => {
      if (!d.show) return 0;

      return 45;
    });
  const trinagleColor = () => '#D95B43';

  const randomDuration = () => (Math.random() * 1000) + 500;

  // Load map data
  $.getJSON('data/psychs.json').done((data) => {
    // Process TopoJSON
    const roads = topojson.feature(
      data, data.objects.roads,
    ).features;

    const border = topojson.feature(data, data.objects.border);

    let providers = topojson.feature(
      data, data.objects.providers,
    ).features.map(d => Object.assign(d, {
      show: false,
      highlight: false,
      offset: (Math.random() * 20) + 90,
    }));

    /*
     * This is an abandoned small multiples chart that explains our specialist
     * study.
     *
    let specialists = d3.range(206).map((d, i) => Object.assign({}, {
      char: 'abcdefghijklmnopqrstuv'[i % 23],
      show: true,
    }));

    const personSize = (d) => {
      if (d.show) return '42px';
      return '18px';
    };

    const people = svg.selectAll('text.specialist')
        .data(specialists)
      .enter().append('text')
        .attr('class', 'specialist')
        .attr('text-anchor', 'middle')
        .attr('font-size', personSize)
        .attr('font-family', 'WeePeople')
        .attr('fill', '#333')
        .text(d => d.char);

    const peopleCluster = d3.forceSimulation()
      .nodes(specialists)
      .force('charge', d3.forceManyBody().strength(-22))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(width / 2))
      .stop()
      .on('tick', () => {
        people
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });
    */

    // Roads
    const roadsLayer = mapLayer.selectAll('.road')
        .data(roads)
      .enter().append('path')
        .attr('class', 'road')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', d => roadColor(d.properties.RTTYP))
        .attr('stroke-width', d => roadWidth(d.properties.RTTYP));

    // TX state border
    const borderLayer = mapLayer.append('path')
      .attr('class', 'state-border')
      .attr('fill', CATEGORICAL_COLORS[0])
      .attr('fill-opacity', 0.25)
      .attr('d', path(border));

    const providerTransform = (d) => {
      const coordinates = projection(d.geometry.coordinates);

      const x = coordinates[0];
      let y = coordinates[1] - 8;

      if (!d.show) y -= d.offset;

      return `translate(${x}, ${y}) rotate(180)`;
    };

    const providersLayer = mapLayer.selectAll('.provider')
      .data(providers).enter()
        .append('path')
        .attr('class', 'provider')
        .attr('d', triangle)
        .attr('transform', providerTransform)
        .attr('fill', trinagleColor);

    const updateProviders = (maxDelay = 0) => {
      mapLayer.selectAll('.provider')
        .data(providers)
        .transition()
          .delay(() => 0 + (Math.random() * maxDelay))
          .duration(randomDuration)
          .attr('d', triangle)
          .attr('transform', providerTransform)
          .attr('fill', trinagleColor);
    };

    const psychFilters = [
      [],
      ['No contact after 3 attempts', 'No phone number'],
      ['Wrong number'],
      ['No longer at practice/practice closed'],
      ['Does not accept MCO', 'Wrong specialist type', 'Does not accept children'],
      ['Does not accept new patients'],
      ['Only sees in-patient'],
    ];

    const psychTiming = [9, 3, 4, 4, 4, 4, 5, 5];
    const psychTotal = psychTiming.reduce((m, v) => m + v, 0);

    let step = -1;
    const forward = () => {
      step += 1;

      if (step >= psychTiming.length) {
        return;
      }

      const stepTiming = psychTiming[step] * 1000;
      const psychNextStep = psychTiming.slice(0, step + 2).reduce((m, v) => m + v, 0);
      const maxBarWidth = $('.progress__container').width();
      const barWidth = (psychNextStep / psychTotal) * maxBarWidth;
      $('.progress__bar')
        .animate({ width: `${barWidth}px` }, stepTiming, 'linear');

      $('.psychs--step-intro').hide();
      $('.psychs--step-current')
        .removeClass('psychs--step-current');

      if (step >= 0 && step <= 6) {
        const exclude = psychFilters.slice(0, step + 1).reduce((m, _) => m.concat(_[0]), []);
        providers = providers.map(d => Object.assign(d, {
          show: exclude.indexOf(d.properties.outcome) === -1,
          highlight: false,
        }));

        $(`.psychs--step-${step}`)
          .addClass('psychs--step-current');
      } else if (step === 7) {
        $('.psychs--step-7')
          .addClass('psychs--step-current');
      }
      /*
      else if (step === 8) {
        mapLayer
          .transition()
          .duration(1500)
            .attr('transform', `translate(${innerWidth * -1}, 0)`);

        window.setTimeout(() => {
          peopleCluster.restart();
        }, 1000);
      } else if (step === 9) {
        specialists = specialists.map((d, i) => Object.assign(d, {
          show: i <= 83,
        }));
      }
      */

      // updateSpecialists();
      updateProviders(stepTiming * 0.25);

      window.setTimeout(() => {
        forward();
      }, stepTiming);
    };

    $('#networks-graphic .psychs--start').on('click', forward);
    $('#networks-graphic .psychs--repeat').on('click', () => {
      $('.progress__bar').remove();
      $('.progress__container').html('<div class=\'progress__bar\' style=\'width: 0px !important;\'></div>');
      step = -1;
      forward();
    });

    window.addEventListener('resize', () => {
      width = getWidth(svg.node().parentNode);
      height = width * aspectRatio;

      projection = getProjection();
      path = path.projection(projection);

      svg.attr('width', width)
        .attr('height', height);

      borderLayer
        .attr('d', path(border));
      roadsLayer
        .attr('d', path);
      providersLayer
        .attr('transform', providerTransform);
    });
  });
};

render();
