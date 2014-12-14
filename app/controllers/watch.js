import Ember from 'ember';
import ENV from "../config/environment";

export default Ember.ObjectController.extend({
  params: null,

  percentageFormatted: function() {
    return parseInt(this.get("value"));
  }.property("value"),

  s3Url: function() {
    return ENV.awsBucketEndpoint + "/" + this.get("location");
  }.property("location"),

  poster: function() {
    return ENV.API_ENDPOINT + "/preview/"+this.get("params.scene")+"/"+this.get("params.image");
  }.property("params.image", "params.scene"),

  overlayUrl: function() {
    return "https://www.filepicker.io/api/file/" + this.get("params.image");
  }.property("params.image"),

  _startPoll: function() { 
    if(!this.get("location") && this.get("model")) {
      this._poll();
    }
  }.observes("location").on("init"),

  _poll: function() {
    Ember.run.later(this, function() {
      $.getJSON(ENV.API_ENDPOINT + "/video/"+this.get("params.scene")+"/"+this.get("params.image")).then(function(result){
        if(result.location) { 
          this.set("_location", result.location);
          this.set("ready", true);
        } else {
          this.set("value", result.value);
          this._poll();
        }
      }.bind(this));
    }, 5000);
  },

  actions: {
    switchVideo: function() {
      this.set("location", this.get("_location"));
    },

    download: function() {
      filepicker.exportFile("http:"+this.get("s3Url"), {});
    },

    socialFb: function() {

    },

    socialTwitter: function() {

    },

    socialPinterest: function() {

    }
  }
});
