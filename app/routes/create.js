import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    /**
     * Set file, transition to crop
     * @param  {File} file to upload
     */
    imageSelected: function(file) {  
      this.send("showLoading");    
      this.controllerFor("create").set("file", file);
      this.transitionTo("create.crop").then(()=>this.send("hideLoading"));
    },
  }
});
