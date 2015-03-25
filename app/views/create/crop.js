import Ember from 'ember';

export default Ember.View.extend({
  /** Initiate cropper by setting up the draggable */
  _setupCropper: function() {
    var container = this.$(".image-preview");
    var offset = container.offset();

    var containment = [ 
        offset.left - container.width(), 
        offset.top - container.height(), 
        offset.left + (container.width()), 
        offset.top + (container.height())
      ]
      
    this.$(".image-preview").draggable({
      //containment: containment
      create: function(event, ui) {
        this.get("controller").set("position", {top: 0, left: 0});
        this.get("controller").set("offset", {top: 0, left: 0});
      }.bind(this),
      stop: function(event, ui) {
        this.get("controller").set("position", ui.position);
        this.get("controller").set("offset", ui.offset);
      }.bind(this)
    });
  }.on("didInsertElement", "controller.url"),

  /** Need to manually set css rotation for the image */
  _imageStyle: function(){
    this.$(".image-preview img").css("transform", "rotate("+this.get("controller.rotation")+"deg)");
  }.observes("controller.rotation"),
});
