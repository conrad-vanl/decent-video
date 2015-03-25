import Ember from 'ember';
import ENV from "../../config/environment";

export default Ember.Controller.extend({
  queryParams: ["scene"],
  scene: "outer-space",

  /** @type {String} Image filename, used to link-to watch route  */
  imageName: Ember.computed.alias("model.filename")

});
