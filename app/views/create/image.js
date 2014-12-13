import Ember from 'ember';

export default Ember.View.extend({
  _filepickerSetup: function() {
    filepicker.pick({
      mimetype: 'image/*',
      container: 'twerk-filepicker-frame',
      mobile: true,
      services: ["COMPUTER", "FACEBOOK", "IMAGE_SEARCH", "INSTAGRAM", "WEBCAM"]
    }, function(blob){
      this.get("controller").send("imageSelected", blob);
    }.bind(this));
  }.on("didInsertElement")
});
