import Ember from 'ember';
import env from "../../config/environment";

export default Ember.Route.extend({
  /** Create simple model object with filename and cloudinary url */
  model: function(params) {
    var filename = decodeURIComponent(params.url);
    return Ember.Object.create({filename: filename, url: env.cloudinary.imageHost + filename});
  }
});
