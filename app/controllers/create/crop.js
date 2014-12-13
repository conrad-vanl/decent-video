import Ember from 'ember';

export default Ember.ObjectController.extend({
  rotation: 0,
  _imageStyle: function(){
    //return "transform: rotate("+this.get("rotation")+"deg)";
    $(".image-preview img").css("transform", "rotate("+this.get("rotation")+"deg)");
  }.observes("rotation"),

  zoom: 0,
  widthScaled: function() {
    // 0 = the width of the mask
    // 1 = 3x the width of the container
    return this.get("zoom") * (800*2) + 800
  }.property("zoom"),

  actions: {
    next: function() {
      this.send("showLoading");
      $(".image-preview-container").addClass("generating");
      html2canvas($(".image-preview-container"), {
        onrendered: function(canvas){
          $(".image-preview-container").removeClass("generating");
          canvas.toBlob(function(blob){
            var reader = new FileReader();

            reader.onloadend = function() {
              var raw = reader.result;
              // strip out data:image/png;base64,
              raw = raw.slice(22);

              filepicker.write({url:this.get("_url")}, raw,
                {
                  base64decode: true
                },

                function(blob) {
                  this.send("hideLoading");
                  this.transitionToRoute("create.scene", encodeURIComponent(blob.url+"?"+(new Date()).getTime()));
                }.bind(this),
                function(error) {
                  this.send("hideLoading");
                  console.log("error", error);
                  alert("There was an error saving your image. Please try again later.");
                },
                function(progress){
                  console.log("progress", progress);
                }
              );
            }.bind(this)

            reader.readAsDataURL(blob);
          }.bind(this));
        }.bind(this)
      })
      // var rotation = this.get("rotation");
      // var position = this.get("position");
      
      // // where x is the distance in pixels from the left edge and y is the distance in pixels from the top edge.
      // var crop = [position.left, position.top, this.get("widthScaled"), this.get("widthScaled")];

      // // rotation must by positive from 0 to 360:
      // if(rotation < 0) rotation = 360 + rotation;

      // console.log("next", crop, rotation);
      
      // filepicker.convert({url:this.get("url")}, {
      //   //width: 800, height: 800,
      //   fit: "crop",
      //   crop: crop 
      //   //rotate: rotation, 
      //   //format: "png"
      // }, {}, 
      // function(blob) {
      //   console.log("blob", blob);
      // },
      // function(error) {
      //   console.log("error", error, error.toString());
      // });
      
    }
  }

});
