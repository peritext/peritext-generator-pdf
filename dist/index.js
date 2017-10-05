'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _fs = require('fs');

var _async = require('async');

var _prince = require('prince');

var _prince2 = _interopRequireDefault(_prince);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generatePdf(_ref, callback) {
  var story = _ref.story,
      template = _ref.template,
      contextualizers = _ref.contextualizers,
      locale = _ref.locale,
      _ref$outputDirPath = _ref.outputDirPath,
      outputDirPath = _ref$outputDirPath === undefined ? './output' : _ref$outputDirPath,
      _ref$tempDirPath = _ref.tempDirPath,
      tempDirPath = _ref$tempDirPath === undefined ? './temp' : _ref$tempDirPath;

  var id = story.id;
  (0, _async.waterfall)([function (cb) {
    var Component = template.component;
    var str = _server2.default.renderToStaticMarkup(_react2.default.createElement(Component, {
      locale: locale,
      contextualizers: contextualizers,
      story: story
    }));
    cb(null, str);
  }, function (str, cb) {
    (0, _fs.writeFile)(tempDirPath + '/' + id + '.html', str, cb);
  }], function (err) {
    if (!err) {
      (0, _prince2.default)().inputs(tempDirPath + '/' + id + '.html').output(outputDirPath + '/' + id + '.pdf').execute().then(function () {
        console.info('saved to pdf with PrinceXML in ' + outputDirPath + '/' + id + '.pdf');
        callback(null, outputDirPath + '/' + id + '.pdf');
      }, function (error) {
        console.error('Prince ERROR: ', error);
        callback(error);
      });
    } else {
      console.error('error during rendering to static html : ', err);
      callback(err);
    }
  });
}

module.exports = generatePdf;
