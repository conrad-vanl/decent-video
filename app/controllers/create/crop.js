import Ember from 'ember';
import env from "../../config/environment";
import AppLoad from "../../mixins/application-loading";

export default Ember.Controller.extend(AppLoad, {
  needs: ["create"],
  file: Ember.computed.alias("controllers.create.file"),
  url: Ember.computed.alias("file.data"),

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

  generate: function() {
    this.set("isGenerating", true);

    return new Ember.RSVP.Promise( (resolve, reject) => {
      html2canvas($(".image-preview-container"), {
        onrendered: (canvas) => {
          this.set("isGenerating", false);

          canvas.toBlob( (blob) => {
            var reader = new FileReader();

            reader.onloadend = () => {
              resolve(reader.result);
            }

            reader.readAsDataURL(blob);
          });
        }
      })
    });
  },

  uploadAndTransition: function(dataUri) {
    var cloudinaryUrl = env.cloudinary.apiHost;
    var url = cloudinaryUrl + env.cloudinary.cloudName + "/image/upload";

    var data =  {
      timestamp: Date.now(),
      api_key: env.cloudinary.apiKey,
      file: dataUri,
      upload_preset: env.cloudinary.uploadPreset
    }

    return Ember.$.post(url, data)
      .then( (data) => { 
        this.transitionTo("create.scene", encodeURIComponent(data.public_id + "." + data.format));
      }).fail( () => { 
        console.error("Error uploading image", arguments); // TODO: better error handling
      });
  },

  actions: {
    next: function() {
      this.send("showLoading");
      this.generate().then(this.uploadAndTransition.bind(this)).finally(() => this.send("hideLoading"));
    }
  }

});
