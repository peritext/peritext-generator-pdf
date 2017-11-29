const path = require('path');
const generatePdf = require('./dist/index');
const template = require('peritext-template-codex-garlic');
const story1 = require('./examples/story');
const storyLinks = require('./examples/links');
const exampleLocale = require('./example-locale');

const contextualizers = {
  bib: require('peritext-contextualizer-bib'),
  codefiles: require('peritext-contextualizer-codefiles'),
  vegalite: require('peritext-contextualizer-vegalite'),
  p5: require('peritext-contextualizer-p5'),
  glossary: require('peritext-contextualizer-glossary'),
  video: require('peritext-contextualizer-video'),
  embed: require('peritext-contextualizer-embed'),
  image: require('peritext-contextualizer-image'),
  table: require('peritext-contextualizer-table'),
  dicto: require('peritext-contextualizer-dicto'),
  webpage: require('peritext-contextualizer-webpage'),
  'data-presentation': require('peritext-contextualizer-data-presentation'),
};

// generatePdf({
//   story: story,
//   contextualizers,
//   template: template,
//   locale: exampleLocale,
//   tempDirPath: path.resolve(__dirname + '/temp'),
//   outputDirPath: path.resolve(__dirname + '/examples')
// });


const stories = [story1, storyLinks].reduce((p, story) => 
  p.then(() => new Promise((resolve, reject) => {
    generatePdf({
      story: story,
      contextualizers,
      template: template,
      locale: exampleLocale,
      tempDirPath: path.resolve(__dirname + '/temp'),
      outputDirPath: path.resolve(__dirname + '/examples')
    }, (err) => {
      if (err) {
        reject(err);
      } else resolve(null);
    });
  }))
  .catch(e => console.log(e)),
  Promise.resolve());