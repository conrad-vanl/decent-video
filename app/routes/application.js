import Ember from 'ember';
import env from "../config/environment";


export default Ember.Route.extend({
  /**
   * Simple app-wide loading indicator
   * @param  {Boolean} show whether to show loading indicator
   */
  loading: function(show) {
    return this.controllerFor("application").set("isLoading", show);
  },

  actions: {

    /** Action for showing loading indicator */
    showLoading: function() { this.loading(true); },

    /** Action for hiding loading indicator */
    hideLoading: function() { this.loading(false); }
  }
});
