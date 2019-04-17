import $ from 'jquery';
import moment from 'moment';

import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);
typeof moment.duration.fn.format === 'function';
typeof moment.duration.format === 'function';

$(document).ready(() => {
  if ($('.pp__audio').length > 0) {
    // play functionality. plays audio and shifts play button to pause button
    $('.pp__audio .fa-play').click(function () {
      console.log('play');
      const audio = $(this).closest('.pp__audio').find('audio');
      audio[0].play();
      $(this).toggleClass('fa-play').toggleClass('fa-pause');

      // adds the click event to the paus button that pauses the audio,
      // swaps it back to play, and removes the click event
      $('.pp__audio .fa-pause').on('click', function () {
        audio[0].pause();
        $(this).toggleClass('fa-play').toggleClass('fa-pause');
        $(this).off('click');
      });
    });


    // cycle through audio on the page and add duration in seconds to that audio's
    // duration element
    $.each($('.pp__audio'), function () {
      // find the audio element
      const thisAudio = $(this).find('audio');
      // add an eventlistener for when the meta data is loaded
      thisAudio[0].addEventListener('loadedmetadata', () => {
        console.log(thisAudio[0].duration);
        // format that duration into mm:ss format
        const duration = moment.duration(thisAudio[0].duration, 'seconds').format('mm:ss');
        // place that duration text on the page
        $(this).find('.duration').text(duration);
        console.log(duration);
      });
    });

    // $.each($('.pp__audio'), function () {
    //   const audio = $(this).children('audio');
    //   const thisAudio = audio[0];
    //
    //   const audioDuration = audio[0].currentSrc;
    //   console.log(thisAudio, audioDuration);
    //
    //   $(this).find('.fa-play').click(function () {
    //     console.log('click');
    //     thisAudio.play();
    //     $(this).toggleClass('fa-play').toggleClass('fa-pause');
    //   });
    //
    //   function updateAudioTime() {
    //     console.log(thisAudio.duration);
    //   }
    //
    //   thisAudio.addEventListener('timeupdate', updateAudioTime, false);
    // });
  }
});
