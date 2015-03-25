import { animate, stop } from "liquid-fire";

// Default options
var defaultOpts = {
  selectors: { from: ".morpher", to: ".morpher" },
  delay: 250,

  // properties to "morph"
  properties: [
    "border",
    "border-radius",
    "background",
    "width",
    "height",
    "zoom",
    "padding",
    "margin"
  ]
}

/**
 * Attempts to morph selected dom elements, then crossFades
 */
export default function (opts = {}) {
  var opts = jQuery.extend({}, defaultOpts, opts);
  
  // Stop any currently running animation on oldView
  stop(this.oldElement);

  return new Ember.RSVP.Promise( (resolve, reject) => {
    // Element that we're morphing
    var morphing = this.oldElement.find(opts.selectors.from);

    // Element that we're morphing to
    var morphTo = this.newElement.find(opts.selectors.to);

    // Properties that we're going to morph
    var props = opts.properties;

    // Build CSS props
    var css = {};
    props.forEach( (prop) => {
      css[prop] = morphTo.css(prop);
    });

    // merge in overrides
    if(opts.css) css = jQuery.extend(css, opts.css);

    // Handle special case (blah!): zoom
    var zoom = parseFloat(css["zoom"]);
    if(zoom) {
      css["width"] = parseFloat(css["width"]) * zoom;
      css["height"] = parseFloat(css["height"]) * zoom;
    }

    Promise.all([
      animate(morphing, css),
      animate(this.oldElement.find("*").not(morphing).not(morphing.parents()), { opacity: 0 })
    ]).then( () => {
      // add slight delay for dramatic effect
      Ember.run.later( () => {
        Promise.all([
          animate(this.oldElement, { opacity: 0 }),
          animate(this.newElement, { opacity: [1, 0]})
        ]).then(resolve, reject);
      }, opts.delay);
    });
  });
}
