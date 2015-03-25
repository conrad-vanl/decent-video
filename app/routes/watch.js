import Ember from 'ember';
import ENV from "../config/environment";

export default Ember.Route.extend({
  /** Create simple Object based off of route params */
  model: function(params) {
    return Ember.Object.create({params: params});
  }
});
