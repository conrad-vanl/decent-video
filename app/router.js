import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  /**
   * Create video routes
   * Entry point is cropping selected photo, then choosing a scene
   */
  this.resource('create', { path: '/' }, function() {
    this.route('crop', { path: "/crop"});
    this.route('scene', { path: "/scene/:url"});
  });

  /**
   * Watch video by scene and image
   */
  this.route('watch', { path: "w/:scene/:image"});
});

export default Router;
