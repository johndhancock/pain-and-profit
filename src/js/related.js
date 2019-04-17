import $ from 'jquery';

$('docuement').ready(() => {

  function populateLinks(data) {
    if (data.length > 0) {
      $('#related-links').removeClass('no-show');
    }
    const linksList = $('#related-links ul');
    data.forEach((link) => {
      linksList.append(`<li><a href='${link.url}'>${link.text}</a>`);
    });
  }

  if ($('#related-links').length > 0) {
    $.ajax({
      url: 'https://interactives.dallasnews.com/data-store/2018/05-2018-pain-profit-related.json',
      cache: false,
      success: populateLinks,
      dataType: 'json',
    });
  }
});
