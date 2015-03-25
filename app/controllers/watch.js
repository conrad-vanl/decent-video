import Ember from 'ember';
import ENV from "../config/environment";

export default Ember.Controller.extend({
  params: Ember.computed.alias("model.params"),

  overlayUrl: function() {
    return ENV.cloudinary.imageHost + this.get("params.image");
  }.property("params.image"),

 });
