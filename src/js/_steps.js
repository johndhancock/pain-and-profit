import $ from 'jquery';

$.fn.steps = function () {
  const self = this;

  // counter to keep track of where we are in the list of steps
  let counter = 0;

  // figure out how many steps we have
  const steps = $('.step').length;
  // figure out how wide our step boxes should be based off the intro graph's width
  let stepWidth = $('.content-well .intro').width();

  // set the width of those step boxes
  $('.step').outerWidth(stepWidth - 5);

  // set the width of the step container based on the # of steps, stepWidths, and the margin
  // between each step (50)
  $('#step-container').css('width', (steps * (stepWidth)) + ((steps - 1) * 50));

  // get the window width. we'll use this to determine if a sceen size change has
  // occurred and reset the width of our steps and step containers, then reposition
  // the step-slider element
  let windowWidth = $(window).width();
  $(window).resize(() => {
    setTimeout(() => {
      const newWidth = $(window).width();
      // if the window width has changed ...
      if (newWidth !== windowWidth) {
        // get the new width of the intro graph
        stepWidth = $('.content-well .intro').width();
        // reset the step and step container width and step-slider position
        $('.step').outerWidth(stepWidth - 5);
        $('#step-container').css('width', (steps * (stepWidth)) + ((steps - 1) * 50));
        self.find('#step-slider').css('left', (counter * (-1 * (stepWidth + 50))));

        // reset our windowWidth so we're ready for the next resize event
        windowWidth = newWidth;
      }
    }, 300);
  });

  // steps taken to update the step list when an interaction occurs
  function updateSteps() {
    // remove the active class from our nav list
    self.find('li').removeClass('active');
    // set the new active class on the appropriate list item based on where counter is
    $('#steps-nav').find('ul li').eq(counter + 1).addClass('active');
    // use counter to reposition the step slider
    self.find('#step-slider').css('left', (counter * (-1 * (stepWidth + 45))));

    // removes the step--active class from any step that has it and applies it to
    // our current step
    $('.step').removeClass('step--active');
    $('.step').eq(counter).addClass('step--active');
  }

  // when a list item in the steps list prior to the steps occurs ...
  $('#step__list li').click(function () {
    // pluck the first character from the li's text and use that to update counter
    const targetCard = parseInt($(this).text().substr(0), 10);
    counter = targetCard - 1;
    updateSteps();

    $('html, body').animate({
      scrollTop: $('#steps').offset().top - 60,
    }, 250);
  });

  // when the step nav is clicked ...
  $('#steps-nav li').click(function () {

    // if it's the left arrow and we're on the first slide, do nothing
    if ($(this).attr('id') === 'left' && counter === 0) {
      return;
    }

    // if it's the right arrow, and we're on the last slide, do nothing
    if ($(this).attr('id') === 'right' && counter >= steps - 1) {
      return;
    }

    // else, if none of the above conditions have been met, update our counter
    // based off the interaction made
    if ($(this).attr('id') === 'left' && counter > 0) {
      counter -= 1;
    } else if ($(this).attr('id') === 'right' && counter < steps - 1) {
      counter += 1;
    } else {
      const targetCard = $(this).text();
      counter = targetCard - 1;
    }

    // then update our steps
    updateSteps();
  });

  // if the link at the end of the step is clicked
  $('.next-step').click(function () {
    // grab the step number from the link's data-attribute
    const targetCard = parseInt($(this).attr('data-step'), 10);
    counter = targetCard - 1;

    // update our steps
    updateSteps();

    // then scroll the window back to the top of the steps, since these links
    // are at the bottom of the step cards
    $('html, body').animate({
      scrollTop: $('#steps').offset().top - 60,
    }, 250);
  });

  // if the top of our steps falls above the halfway point of the window window height
  // and the bottom of our steps isn't above our window bottom, show our step nav
  $(window).scroll(() => {
    const windowTop = $(window).scrollTop();
    const windowHeight = $(window).height();

    if (windowTop + (windowHeight / 2) > $('#steps').offset().top &&
        windowTop + windowHeight < $('#steps').offset().top + $('#steps').height()) {
      console.log('shown');
      $('#steps-nav').addClass('shown');
    } else {
      $('#steps-nav').removeClass('shown');
    }
  });
}
