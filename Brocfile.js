/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  fingerprint: {
    exclude: ["deflate.js", "inflate.js", "zip.js", "zip-ext.js", "zip-fs.js"],
    extensions: ['js', 'css'],
    prepend: '//mad-decent-twerkshop.s3.amazonaws.com/'
  }
});

app.import("bower_components/materialize/js/waves.js");

app.import("bower_components/jquery-ui/jquery-ui.js");
app.import("bower_components/jquery-ui-touch-punch/jquery.ui.touch-punch.js");
app.import("bower_components/html2canvas/build/html2canvas.js");
app.import("bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.js");

app.import("bower_components/materialize/font/material-design-icons/Material-Design-Icons.eot", {
  destDir: 'font/material-design-icons'
});
app.import("bower_components/materialize/font/material-design-icons/Material-Design-Icons.svg", {
  destDir: 'font/material-design-icons'
});
app.import("bower_components/materialize/font/material-design-icons/Material-Design-Icons.ttf", {
  destDir: 'font/material-design-icons'
});
app.import("bower_components/materialize/font/material-design-icons/Material-Design-Icons.woff", {
  destDir: 'font/material-design-icons'
});


app.import("vendor/zip.js");
// app.import("vendor/inflate.js", { destDir: 'vendor' });
// app.import("vendor/deflate.js", { destDir: 'vendor' });
// app.import("vendor/z-worker.js", { destDir: 'vendor' });


module.exports = app.toTree();
