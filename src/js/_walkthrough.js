import $ from 'jquery';
import imagesLoaded from 'imagesloaded';

imagesLoaded.makeJQueryPlugin($);

$.fn.walkthrough = function () {
  const self = this;

  // get total number of slides in the walkthrough
  const totalSlides = self.find('.walkthrough__slide').length;

  // set an initial counter for which slide we're on
  let slideCounter = 0;

  // we want all of our slides to have the same height, regardless of content, so
  // the bottom of the walkthrough doesn't bounce around slide-to-slide. interate
  // over the slides, find the tallest one, and set all slides to that height
  function setSlidesHeight() {
    let tallest = 0;

    $.each(self.find('.walkthrough__slide'), function () {
      tallest = $(this).height() > tallest ? $(this).height() : tallest;
    });

    $('.walkthrough__slide').css('height', tallest);
  }

  // wait til the images are loaded before we set the slides height.
  // self.find('.walkthrough__slide').imagesLoaded(() => {
  //   setSlidesHeight();
  // });

  // each time a previous or next button is updated, we're going to change slides
  function updateSlide(t) {
    // remove the active class from the active slide
    self.find('.slide--active').removeClass('slide--active');
    // find the new active slide and set it to be active
    self.find('.walkthrough__slide').eq(t).addClass('slide--active');

    // calculate what percentage we are through the walkthrough, and update the progress__bar
    // to reflect that
    const newPercentage = ((t + 1) / totalSlides) * 100;
    self.find('.progress__bar').css('width', `${newPercentage}%`);

    // control which buttons are displayed depending on where we are in the walkthrough
    if (t === totalSlides - 1) {
      $('.walkthrough__next').addClass('no-show');
    } else if (t === 0) {
      $('.walkthrough__previous').addClass('no-show');
    } else {
      $('.walkthrough__button').removeClass('no-show');
    }
  }

  // when a button is clicked, determine if it's next or previous, update the
  // slideCounter variable to reflect that, then update the slide
  $('.walkthrough__button').click(function () {
    if ($(this).hasClass('walkthrough__next') === true) {
      slideCounter += 1;
      updateSlide(slideCounter);
    } else if ($(this).hasClass('walkthrough__previous') === true) {
      slideCounter -= 1;
      updateSlide(slideCounter);
    }
  });

  // run the initial updateSlide function to control button displays and progress bar
  updateSlide(slideCounter);
};
