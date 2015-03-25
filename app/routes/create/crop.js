import Ember from 'ember';

export default Ember.Route.extend({
  /** Make sure that there is a file to crop, if not transition back to beginning of process */
  beforeModel: function(transition) {
    if(!this.controllerFor("create").get("file")) return this.transitionTo("create");
  }
});
