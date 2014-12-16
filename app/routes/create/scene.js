import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var url = decodeURIComponent(params.url);
    return Ember.Object.create({url: url});
  },
  afterModel: function() {
    if(ga && typeof(ga) == "function") {
      ga('send', 'event', 'video:creation', "scene-selection"); 
    }
  }
});
