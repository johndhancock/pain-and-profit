import $ from 'jquery';
import balanceText from 'balance-text';

import './furniture';
import './related';
import './rtp';
import './_steps';
import './_walkthrough';
import './viz';


$(document).ready(() => {
  balanceText();

  function displayExplainerScroll() {
    const triggerPoint = $(window).scrollTop() + ($(window).height() * 0.75);
    $.each($('.explainer--hidden'), function () {
      if ($(this).offset().top <= triggerPoint) {
        $(this).removeClass('explainer--hidden')
          .addClass('explainer--scroll-displayed');
      }
    });
  }

  function displayExplainerClick(el) {
    $('.explainer').removeClass('explainer--click-displayed');
    // get the explainer element that's paired with the highlight clicked
    const targetExplainer = el.parent().prev();

    let targetYPos = 0;
    const elYPos = el[0].getBoundingClientRect().top;
    const windowHt = $(window).height();

    if (elYPos < (windowHt / 2)) {
      targetYPos = elYPos + el.height() + 10;
    } else {
      targetYPos = elYPos - targetExplainer.outerHeight() - 10;
    }

    targetExplainer.css('top', `${targetYPos}px`)
      .addClass('explainer--click-displayed');
  }


  $('.highlight').click(function () {
    if ($(window).width() >= 901) {
      return;
    }
    displayExplainerClick($(this));
  });


  // ---------------------------------------------------------------------------
  //  NAVIGATION SETUP AND CONTROLS
  // ---------------------------------------------------------------------------

  const $storyNav = $('.pp__nav');

  function setActivePart() {
    let activePart = 0;
    if ($storyNav.attr('data-activepart') === 'documents') {
      activePart = $('.pp__nav ul li').length - 1;
    } else {
      activePart = parseInt($storyNav.attr('data-activepart'), 10) - 1;
    }

    const activeText = $('.pp__nav ul li').eq(activePart).children('a').html();
    $('.pp__nav h6').html(activeText);
  }

  $('.pp__nav h6').click(() => {
    $('.pp__nav ul').toggleClass('displayed');
  });

  setActivePart();


  // ---------------------------------------------------------------------------
  //  WINDOW SCROLLING
  // ---------------------------------------------------------------------------

  const navTrigger = $('.pp__intro').offset().top + $('.pp__intro').outerHeight();

  $(window).scroll(() => {
    $('.pp__nav ul').removeClass('displayed');

    // if the window has scrolled past the nav trigger (set above), show the sticky nav
    if ($(window).scrollTop() > navTrigger) {
      $storyNav.addClass('displayed');
    } else {
      $storyNav.removeClass('displayed');
    }

    // when the window scrolls, hide any explainers that are showing
    $('.explainer--click-displayed').removeClass('explainer--click-displayed');

    // if a large screen, check to see if we've passed any explainer's trigger point
    if ($(window).width() >= 901) {
      displayExplainerScroll();
      $('.explainer').css('top', '0');
    }
  });


  // check if walkthrough elements exist on the page, and if so, run the walkthrough
  // method on them

  if ($('#walkthrough__2to1').length > 0) {
    $('#walkthrough__2to1').walkthrough();
  }

  if ($('#walkthrough__part4-timeline').length > 0) {
    $('#walkthrough__part4-timeline').walkthrough();
  }

  if ($('#steps').length > 0) {
    $('#steps').steps();
  }
});
