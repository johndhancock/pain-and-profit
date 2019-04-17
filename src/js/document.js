import $ from 'jquery';
// import './furniture';

$('document').ready(() => {
  /*
  -----------------------------------------------------------------------------
  GETTING VALUES OF URL PARAMETERS
  -----------------------------------------------------------------------------
  given a parameter from the url, pull it's value and return it.
  */

  function getUrlParameter(sParam) {
    // pull the url of the page
    const sPageURL = decodeURIComponent(window.location.search.substring(1));
    // split the base url from the parameters
    const sURLVariables = sPageURL.split('&');
    let sParameterName

    // iterate over the parameters. if the parameter name matches the passed parameter,
    // return it's value
    for (let i = 0; i < sURLVariables.length; i += 1) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
    return undefined;
  }

  // get the document number and title
  const docNumber = getUrlParameter('number');
  const docTitle = getUrlParameter('title').replace('.html', '');

  // check if the title contains a reference to an annotation, if so, set docAnnotation
  let docAnnotation;
  if (docTitle.indexOf('#document') > -1) {
    const docTitleParts = docTitle.split('/');
    docAnnotation = docTitleParts[docTitleParts.length - 1].replace('a', '');
  }

  // clean the docTitle of any hyphens
  const docClean = docTitle.replace(/-/g, ' ');

  // create the fullDocString based on whether an annotation exists or not
  const fullDocString = docAnnotation !== undefined ?
    `${docNumber}-${docTitle}/annotations/${docAnnotation}` :
    `${docNumber}-${docTitle}`;

  // create the html block for the documentCloud viewer and append it to the document-container element
  let dc = '';
  dc += `<div id="DV-viewer-${fullDocString}" class="DC-embed DC-embed-document DV-container"></div>`;
  dc += `<script>
          DV.load("https://www.documentcloud.org/documents/${fullDocString}.js", {
            responsive: true,
            container: "#DV-viewer-${fullDocString}"
          });
        </script>`;
  dc += `<noscript>
          <a href="https://www.documentcloud.org/documents/${docNumber}/${docTitle}.pdf">${docClean} (PDF)</a>
          <br />
          <a href="https://www.documentcloud.org/documents/${docNumber}/${docTitle}.txt">${docClean} Text</a>
        </noscript>`;

  $('#document-container').html(dc);
});
