import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var url = decodeURIComponent(params.url);
    return Ember.Object.create({url: url});
  }
});
