import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('create', { path: 'twerk' }, function() {
    //this.route('image');
    this.route('crop', { path: "/crop/:url"});
    this.route('scene', { path: "/scene/:url"});
  });

  this.route('watch', { path: "w/:scene/:image"});
});

export default Router;
