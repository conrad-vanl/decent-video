import Ember from 'ember';
import ENV from "../../config/environment";

export default Ember.ObjectController.extend({
  queryParams: ["scene"],
  scene: "outer-space",

  imageName: function() {
    return this.get("url").split("file/")[1].split("?")[0];
  }.property("url"),

  posterOuterSpace: function() {
    if(!this.get("imageName")) return;
    return ENV.API_ENDPOINT + "/preview/outer-space/"+this.get("imageName");
  }.property("imageName"),

  posterOutlawOnSkis: function() {
    if(!this.get("imageName")) return;
    return ENV.API_ENDPOINT + "/preview/outlaw-on-skis/"+this.get("imageName");
  }.property("imageName"),

  posterTwerkmobile: function() {
    if(!this.get("imageName")) return;
    return ENV.API_ENDPOINT + "/preview/twerkmobile/"+this.get("imageName");
  }.property("imageName"),

  posterWelcomeToHell: function() {
    if(!this.get("imageName")) return;
    return ENV.API_ENDPOINT + "/preview/welcome-to-hell/"+this.get("imageName");
  }.property("imageName"),
});
