import $ from 'jquery';

$(document).ready(() => {


  function updateBackground(imagePath) {
    if (imagePath === 'none') {
      $('.medicaid-art').css('background-image', 'none');
    } else {
      $('.medicaid-art').css('background-image', `url(images/${imagePath}.gif)`);
    }
  }

  function loadNext(imagePath) {
    const preload = new Image();
    preload.src = `images/${imagePath}.gif`;
  }

  $(window).scroll(() => {
    let currentImage;
    let nextImage;

    // setting window dimensions
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    const windowMidpoint = scrollTop + (windowHeight / 2);

    $.each($('.pp__slide'), function () {
      // for each slide, set variables for it's offset top and milestone id
      const slideContentTop = $(this).offset().top;

      // if this slide is above the bottom of the window  and has a defined data-slide attribute
      // update the slideMilestone variable with this slide's number
      if (slideContentTop < windowMidpoint) {
        currentImage = $(this).attr('data-image');
        nextImage = $(this).next().attr('data-image');
      }
    });

    if (currentImage !== undefined) {
      updateBackground(currentImage);
    }
    if (nextImage !== undefined) {
      loadNext(nextImage);
    }
  });
});
