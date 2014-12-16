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

  // _startPoll: function() { 
  //   if(!this.get("location") && this.get("model")) {
  //     this._poll();
  //   }
  // }.observes("location").on("init"),

  // _poll: function() {
  //   Ember.run.later(this, function() {
  //     $.getJSON(ENV.API_ENDPOINT + "/video/"+this.get("params.scene")+"/"+this.get("params.image")).then(function(result){
  //       if(result.location) { 
  //         this.set("_location", result.location);
  //         this.set("ready", true);
  //       } else {
  //         this.set("value", result.value);
  //         this._poll();
  //       }
  //     }.bind(this));
  //   }, 5000);
  // },

  shareMessage: "Watch my decent Christmas video with Mad Decent\'s a Very, Very Decent Xmas!",

  downloadAction: function() {
    if(this.get("location") && this.get("location").length > 0) return "download";
    if(this.get("status") && this.get("status") == "found") return "downloadPending";
    return "requestDownload";
  }.property("location","status"),

  actions: {
    switchVideo: function() {
      this.set("location", this.get("_location"));
    },

    download: function() {
      filepicker.exportFile("http:"+this.get("s3Url"), {});
    },

    socialFacebook: function() {
      FB.ui(
       {
        method: 'share',
        href: location.href
      }, function(response){});
      if(ga && typeof(ga) == "function") {
        ga('send', 'event', 'social:share', "facebook"); 
      } 
    },

    socialTwitter: function() {
      var url = "http://www.twitter.com/share?text="
        +encodeURIComponent(this.get("shareMessage").substr(0,90))
        +"&hashtags="+"decentxmas"
        + "&via=maddecent"
        +"&url="+encodeURIComponent(location.href);

      window.open(url,'','width=800,height=300,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      if(ga && typeof(ga) == "function") {
        ga('send', 'event', 'social:share', "twitter"); 
      } 
    },

    // &media={URI-encoded URL of the image to pin}&description={optional URI-encoded description}
    socialPinterest: function() {
      var url = "http://pinterest.com/pin/create/button/?url="
        +encodeURIComponent(location.href)
        +"&media="+encodeURIComponent(this.get("poster"))
        +"&description="+encodeURIComponent(this.get("shareMessage"));

      if(ga && typeof(ga) == "function") {
        ga('send', 'event', 'social:share', "pinterest"); 
      } 
      window.open(url,'','width=800,height=300,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
    }
  }
});
