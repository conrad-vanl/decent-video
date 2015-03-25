import Ember from 'ember';
export default Ember.Mixin.create({
  needs: ["application"],
  isLoading: Ember.computed.alias("controllers.application.isLoading")
});
