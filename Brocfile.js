/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  fingerprint: {
    exclude: ["deflate.js", "inflate.js", "zip.js", "zip-ext.js", "zip-fs.js"],
    extensions: ['js', 'css', 'jpg', 'png', 'gif', 'ttf', 'eot', 'svg', 'otf'],
    prepend: '//mad-decent-twerkshop.s3.amazonaws.com/'
  }
});

app.import("bower_components/jquery-ui/jquery-ui.js");
app.import("bower_components/jquery-ui-touch-punch/jquery.ui.touch-punch.js");

app.import("bower_components/cloudinary/js/jquery.cloudinary.js");

app.import("bower_components/html2canvas/build/html2canvas.js");
app.import("bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.js");

app.import("vendor/zip.js");

module.exports = app.toTree();