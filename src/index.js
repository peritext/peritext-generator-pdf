import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {writeFile} from 'fs';
import {waterfall} from 'async';
import Prince from 'prince';

function generatePdf ({
  story,
  template,
  contextualizers,
  locale,
  outputDirPath = './output',
  tempDirPath = './temp',
}, callback) {
  const id = story.id;
  waterfall([
    (cb) => {
      const Component = template.component;
      const str = ReactDOMServer.renderToStaticMarkup(
        <Component 
          locale={locale} 
          contextualizers={contextualizers} 
          story={story} 
        />
      );
      cb(null, str);
    },
    (str, cb) => {
      writeFile(`${tempDirPath}/${id}.html`, str, cb)
    }
  ], (err) => {
    if (!err) {
      Prince()
      .inputs(`${tempDirPath}/${id}.html`)
      .output(`${outputDirPath}/${id}.pdf`)
      .execute()
      .then(function() {
        console.info(`saved to pdf with PrinceXML in ${outputDirPath}/${id}.pdf`);
        callback(null, `${outputDirPath}/${id}.pdf`);
      }, function(error) {
        console.error('Prince ERROR: ', error);
        callback(error);
      });
    } else {
      console.error('error during rendering to static html : ', err);
      callback(err);
    }
  })
}

module.exports = generatePdf;