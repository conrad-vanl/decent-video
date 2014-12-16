import Ember from 'ember';

export default Ember.Component.extend({
  setup: function() {
    var player = new Clappr.Player({
      source: this.get("url"), poster: this.get("poster"), 
      width: 640, 
      height: 640,
      gaAccount: "4ff1a512d7424564944465772bbe8bc1"
      gaTracker:  "video"
    });
    player.attachTo(this.$()[0]);

    window.p = player;
  }.on('didInsertElement')
});
