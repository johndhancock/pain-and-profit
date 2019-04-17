/* eslint-disable import/prefer-default-export */
import debounce from 'lodash.debounce';
import * as d3 from 'd3';


const getWidth = (el) => {
  const elStyle = window.getComputedStyle(el, null);
  return (
    el.clientWidth -
    +elStyle.getPropertyValue('padding-left').replace('px', '') -
    +elStyle.getPropertyValue('padding-right').replace('px', '')
  );
};


const responsiveRender = (renderer) => {
  renderer();

  try {
    document.fonts.onloadingdone = () => {
      renderer();
    };
  } catch (e) {
    // pass
  }

  let startingWidth = window.innerWidth;
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth !== startingWidth) {
      renderer();
      startingWidth = window.innerWidth;
    }
  }, 200));
};


const splitText = (t, splitOn = ' ') => {
  t.each(function splitLabel(label) {
    const existing = d3.select(this);
    existing.text('');

    label.split(splitOn).forEach((line, idx) => {
      existing.append('tspan') // insert two tspans
        .attr('x', 0)
        .attr('dy', `${0.8 + (idx * 0.4)}em`)
        .text(line);
    });
  });
};


export {
  getWidth,
  responsiveRender,
  splitText,
};
