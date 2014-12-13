import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var url = decodeURIComponent(params.url);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if(!url) reject();

      // verify image
      filepicker.read({url:url}, {
        base64encode: true,
        cache: true
      }, 
        function(blob) {
          resolve(Ember.Object.create({url:"data:image/png;base64,"+blob, _url: url}));
        }.bind(this),
        function(e) { reject(e); }
      );
    });
    //return Ember.Object.create({url: url});
  }
});
