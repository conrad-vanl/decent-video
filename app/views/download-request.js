import Ember from 'ember';

export default Ember.View.extend({
  classNames: ["modal"],
  _openModal: function() {
    this.$().openModal({
      complete: function() { 
        if(this.get("controller") && this.get("controller").send)
          this.get("controller").send("closeModal"); 
        }.bind(this)
    });
  }.on("didInsertElement")
});
