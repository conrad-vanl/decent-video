import Ember from 'ember';
import ENV from "../config/environment";

export default Ember.Route.extend({
  model: function(params) {
    this.controllerFor("watch").set("params", params);
    return $.getJSON(ENV.API_ENDPOINT + "/video/"+params.scene+"/"+params.image);
  },

  actions: {
    requestDownload: function() {

      this.send("closeModal");
      this.render('download-request', {
        into: 'application', 
        outlet: 'modal',
        view: "download-request"
      });

      if(ga && typeof(ga) == "function") {
        ga('send', 'event', 'download', "request"); 
      } 
    },

    startDownload: function(controller) {
      controller.set("isLoading", true);
      $.post(ENV.API_ENDPOINT + "/video", {
        email: controller.get("email"),
        scene: this.controllerFor("watch").get("params.scene"),
        image: this.controllerFor("watch").get("params.image")
      }).then(function() {
        controller.set("isLoading", false);
        this.controllerFor("watch").set("status", "found");
        this.send("showDownloadStartSuccess");
      }.bind(this));

      if(ga && typeof(ga) == "function") {
        ga('send', 'event', 'download', "start"); 
      } 
    },

    showDownloadStartSuccess: function() {
      this.send("closeModal");
      this.render('download-request-success', {
        into: 'application', 
        outlet: 'modal',
        view: "download-request"
      });
    },

    downloadPending: function() {
      this.send("closeModal");
      this.render('download-request-pending', {
        into: 'application', 
        outlet: 'modal',
        view: "download-request"
      });
    },

    closeModal: function() {
      this.disconnectOutlet({outlet: "modal", parentView: "application"});
    }
  }
});
