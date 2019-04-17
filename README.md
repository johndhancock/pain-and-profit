# interactive_pain-and-profit

This is an interactive presentation graphic built using the [`dmninteractives` Yeoman generator](https://github.com/DallasMorningNews/generator-dmninteractives).

## Project-specific Notes

### Headline placement and hero image specs

As much as possible, hero images should be cropped at a 3000 x 1750, with the generator handling responsive image sizing. These hero images are used as the background image for the `.hero-image` element. However, because the stylesheet will be shared across pages, each page's `.hero-image` element should be given a unique id that sets the background image in the `HERO BLOCKS` section of styles.scss, along with background positioning to ensure subject matter is always in frame. Don't forget to set a responsive size as well at the 900px breakpoint (see existing styles in the stylesheet as an example).

The main head sits on top of the hero image on large screens and can be placed strategically to avoid interference with hero image subject matter. Placements are either upper left, upper right, lower left and lower right. Control the placement using the classes `display-type--upper-left`, `display-type--upper-right`, `display-type--lower-left` and `display-type--upper-right` on the `.display-type` element.

### Highlights and callouts

Specific terms and text can be highlighted to provide definitions of terms, explain how policies should work and did work, and highlight particular findings.

**Highlights:** Highlighting text requires the text to be wrapped in a `span` tag with the class of `highlight`. Example: `<span class="highlight">2:1 ratio</span>`

**Explainer blocks:** Explainer blocks are the callouts that provide the context to the highlights. On large screens, they sit on the right well adjacent to the graph that contains the corresponding highlight. On small screens, they are activated by clicking the highlight. Types of explainer blocks (for now) include terms, findings and how it works. Within the DOM, they precede the paragraph that contains the highlight.

There is the opportunity for any of these to link off to secondary pages. For example, the findings page would probably link to a templated findings page that lives within the Pain and Profit design ecosystem. Likewise, if there are enough terms throughout the series to build a dedicated glossary page, terms could link to that.

Example explainer block:

```HTML
  <div class="explainer explainer__findings explainer--hidden">
   <h6><i class="fa fa-check-square"></i> Our findings</h6>
   <p><em>A Dallas Morning News</em> investigation found that the Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </div>
```

### walkthrough__slide

Larger, side-bar type material can be told through a "walkthrough" element, which is essentially a slideshow. Sample walkthrough setup:

```HTML
<div class="walkthrough" id="walkthrough__2to1">
  <div class="walkthrough__container clearfix">
    <h4>What is a 2:1 ratio?</h4>

    <div class="walkthrough__button-container">
      <button class="walkthrough__button walkthrough__previous"><i class="fa fa-chevron-left"></i></button>
      <button class="walkthrough__button walkthrough__next"><i class="fa fa-chevron-right"></i></button>
    </div>

    <div class="progress__container">
      <span class="progress__bar"></span>
    </div>

    <div class="walkthrough__slides">
      <div class="walkthrough__slide clearfix slide--active">
        <div class="walkthrough__image">
          <img src="images/_defaultImage.jpg" alt="Alt text" />
        </div>
        <div class="walkthrough__content">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>

      <div class="walkthrough__slide clearfix ">
        <div class="walkthrough__image">
          <img src="images/_defaultImage.jpg" alt="Alt text" />
        </div>
        <div class="walkthrough__content">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

In addition, call the `walkthrough` method on the id of the walkthrough container:
```javascript
  $('#walkthrough__2to1').walkthrough();
```

### Section caps

The first letter of the first paragraph after a subhead should get the section dropcap style. To accomplish this, wrap that letter in a span with the class `sectioncap`.


### pullquotes

```HTML
<div class="image-block quote--inset">
  <blockquote>I’m still going without a nurse. I haven’t seen a nurse in so long, I don’t know what they smell like.</blockquote>
  <p class="attribution">George Berry, 55, who hasn't seen a nurse in a really long time.</p>
</div>
```
## Requirements

- Node - `brew install node`
- Gulp - `npm install -g gulp-cli`

## Local development

#### Installation

1. `npm install` to install development tooling
2. `gulp` to open a local development server

#### What's inside

- `src/index.html` - HTML markup, which gets processed by Nunjucks
- `src/js/*.js` - Graphic scripts, written in ES2015 (it'll be transpiled with Babel)
- `src/scss/*.scss` - Graphic styles in SCSS
- `src/data/*` - files that should be both published and committed to the repository (probably CSVs, JSON, etc.); copied to `dist/data/*` by Gulp
- `src/assets/*` - assets (probably media assets, such as Illustrator files) that don’t get copied by Gulp but are tracked by `git`
- `dist/*` - All of the above, transpiled

_Important caveat:_ Video, audio and ZIP files are ignored by `git` regardless of where they're saved. You'll need to manually alter the [`.gitignore`](.gitignore) file to have them committed to Github.

#### Publishing

`gulp publish` will upload your [`dist/`](dist/) folder to the `2018/pain-and-profit/` folder on our interactives S3 bucket.

## Copyright

&copy;2018 The Dallas Morning News
