import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {
    if(!this.controllerFor("create").get("file")) return this.transitionTo("create");
  }
});
