import Ember from 'ember';
import ENV from "../../config/environment";

export default Ember.Controller.extend({
  queryParams: ["scene"],
  scene: "outer-space",

  imageName: Ember.computed.alias("model.filename"),

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
