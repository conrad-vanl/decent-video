import Ember from 'ember';

export default Ember.Route.extend({
  loading: function(show) {
    this.controllerFor("application").set("isLoading", show);
  },

  actions: {
    pickImage: function() {
      filepicker.pick({
        mimetype: 'image/*',
        //container: container,
        //mobile: true,
        services: ["COMPUTER", "FACEBOOK", "IMAGE_SEARCH", "INSTAGRAM", "WEBCAM"]
      }, function(blob){
        this.send("showLoading");
        filepicker.convert(blob, 
          { width: 2000, height: 2000, fit: 'crop', align: 'faces', format: "png" }, // conversion options,
          {}, // storage options
          function(result) {
            this.send("hideLoading");
            this.transitionTo("create.crop", encodeURIComponent(result.url));
          }.bind(this),
          function(error){
            this.send("hideLoading");
            alert("There was an error selecting your image. Please try again.");
          }.bind(this)
        );

      }.bind(this));

      if(ga && typeof(ga) == "function") {
        ga('send', 'event', 'pickImage', "opened"); 
      }
    },

    showLoading: function() { this.loading(true); },
    hideLoading: function() { this.loading(false); }
  }
});
