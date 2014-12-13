import Ember from 'ember';

export default Ember.ObjectController.extend({
  queryParams: ["scene"],
  scene: "welcome-to-hell",

  imageName: function() {
    return this.get("url").split("file/")[1].split("?")[0];
  }.property("url")
});
