import Ember from 'ember';

export default Ember.Component.extend({
  setup: function() {
    var player = new Clappr.Player({source: this.get("url"), width: 640, height: 640});
    player.attachTo(this.$()[0]);

    window.p = player;
  }.on('didInsertElement')
});
