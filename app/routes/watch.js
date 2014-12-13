import Ember from 'ember';
import ENV from "../config/environment";

export default Ember.Route.extend({
  model: function(params) {
    this.controllerFor("watch").set("params", params);
    return $.getJSON(ENV.API_ENDPOINT + "/video/"+params.scene+"/"+params.image);
  }
});
