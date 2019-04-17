import $ from 'jquery';
import balanceText from 'balance-text';
import './furniture';
import './related';

/* global $:true window:true */

$('document').ready(() => {

  balanceText();
  const MAXSLIDES = 0;
  let currentSlide = 0;

  /*
  --------------------------------------
  CHANGING SLIDES
  --------------------------------------
  */

  // removing the intro overlay if the skip intro button is clicked
  function removeIntro() {
    $('#home-content').removeClass('no-show');
    $('.home-footer').removeClass('no-show');
    $('#intro').fadeOut(1000);
    clearInterval(advanceTimer);
  }

  // clicking the intro_skip button
  $('#intro__skip').on('click', removeIntro);

  // updates the slide, moving forward or backward based on the currentSlide variables
  // also updates the slide nav at the bottom of the screen
  function updateSlide() {
    // fade out current slide and fade in next/previous slide based on direction
    $('.intro__slide').fadeOut(1000);

    setTimeout(() => {
      $('.intro__slide').eq(currentSlide).fadeIn(1000);
    }, 1100);
  }

  // checks if we are not at the end of the slides yet. if not, update currentSlide and
  // update slides
  function advanceSlide() {
    if (currentSlide < MAXSLIDES) {
      currentSlide += 1;
      updateSlide();
    } else {
      removeIntro();
    }
  }

  // our timer that will auto advance the slider every 7.1 seconds
  // (2.1 seconds for animation, 5 seconds for read time)
  const advanceTimer = setInterval(() => { advanceSlide(); }, 7100);

  $(window).scroll(() => {
    if ($(window).scrollTop() > 100) {
      $('.arrow-indicator').fadeOut(500);
    } else {
      $('.arrow-indicator').fadeIn(500);
    }
  });
});
