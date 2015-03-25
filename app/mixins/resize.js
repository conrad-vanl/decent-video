import Ember from 'ember';

export default Ember.Mixin.create(Ember.Evented, {

  bindResize: function(opts) {
    var action, _this = this;

    action = function(e){ 
      _this.trigger("resize");
      if(_this.resized) return _this.resized(e); 
    };

    this._resize = action;

    $(window).bind('resize', this._resize);
  }.on("didInsertElement"),

  unbindResize: function() {
    $(window).unbind('resize', this._resize);
  }.on("willDestroyElement"),

  _windowProperties: function() {
    this.set("windowHeight", $(window).height());
    this.set("windowWidth", $(window).width());
  }.on("resize", "didInsertElement")

});
