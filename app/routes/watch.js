import Ember from 'ember';
import ENV from "../config/environment";

export default Ember.Route.extend({
  model: function(params) {
    return Ember.Object.create({params: params});
  }
});
