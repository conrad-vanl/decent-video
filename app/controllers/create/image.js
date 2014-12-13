import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    imageSelected: function(blob) {
      //this.transitionToRoute("create.crop", encodeURIComponent(blob.url))
      this.send("showLoading");
      filepicker.convert(blob, 
        { width: 2000, height: 2000, fit: 'crop', align: 'faces' }, // conversion options,
        {}, // storage options
        function(result) {
          this.send("hideLoading");
          this.transitionToRoute("create.crop", encodeURIComponent(result.url));
        }.bind(this),
        function(error){
          this.send("hideLoading");
        }.bind(this)
      );
    }
  }
});
