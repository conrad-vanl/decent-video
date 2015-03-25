import Ember from 'ember';
import env from "../../config/environment";
import AppLoad from "../../mixins/application-loading";

export default Ember.Controller.extend(AppLoad, {
  needs: ["create"],
  
  /** @type {File} File object for uploaded image */
  file: Ember.computed.alias("controllers.create.file"),

  /** @type {String} data-uri for uploaded image */
  url: Ember.computed.alias("file.data"),

  /** @type {Number} Rotation of cropper in deg */
  rotation: 0,

  /** @type {Number} Zoom amount of cropper, 0 to 1 */
  zoom: 0,

  /** The width to render the image at */
  widthScaled: function() {
    // 0 = the width of the mask
    // 1 = 3x the width of the container
    return this.get("zoom") * (800*2) + 800
  }.property("zoom"),

  /**
   * Create File Blob for cropped/rotated head shot
   * @return {Promise} resolves with blob
   */
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

  /**
   * Upload rotated/cropped image and transition to scene selection
   * - uploads to cloudinary
   * - transitions to "create.scene"
   */
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
    /**
     * User-invoked action that generates image and transitions to scene selection
     */
    next: function() {
      this.send("showLoading");
      this.generate().then(this.uploadAndTransition.bind(this)).finally(() => this.send("hideLoading"));
    }
  }

});
