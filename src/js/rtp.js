import $ from 'jquery';
import ReturnToPlace from 'returntoplace';


$(document).ready(() => {
  $('.bookmark').click(() => {
    $('.rtp-container').slideToggle();
  });

  // new return to place instance. autostore is set to false, and set with the
  // #rtp-setter button click below
  const rtp = new ReturnToPlace(document.querySelectorAll('body p'), {
    onReturn: (callback) => {
      $('.rtp-modal').removeClass('no-show');
      $('.rtp-approval').click(() => {
        callback();
        $('.rtp-modal').remove();
      });
      $('.rtp-declined').click(() => {
        $('.rtp-modal').remove();
      });
    },
  });

  $('#rtp-setter').click(() => {
    rtp.storePosition();
    $('.rtp-container').slideToggle();
  });

  $('.form-reminder').on('submit', function(e) {
    e.preventDefault();
    const $form = $(this);
    const $fieldset = $form.find('fieldset');
    const email = $form.find('#email').val();
    const when = $form.find('#rtp-when option:selected').attr('val');
    const time = $form.find('#rtp-time option:selected').attr('val');

    const reminder = `${when} ${time}`;
    $fieldset.attr('disabled', true);
    const successHandler = function (success_msg) {
      $fieldset.attr('disabled', false);
      $('.status-update').text(`Got it. We’ll email you ${when}.`);
    };
    const errorHandler = function (error_msg) {
      $fieldset.attr('disabled', false);
      $('.status-upate').text('Oops. Something went wrong. Our apologies. Try requesting a reminder again later.');
    };

    rtp.setReminder(email, reminder, successHandler, errorHandler);
  });
});
// RETURN TO PLACE LIBRARY
