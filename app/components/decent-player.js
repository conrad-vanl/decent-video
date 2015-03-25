import Ember from 'ember';
import ENV from "../config/environment";
import Resize from "../mixins/resize";
var rad = Math.PI / 180;

/**
 * A very decent component to sync user uploaded content with 
 * pre-recorded video.
 */
export default Ember.Component.extend(Resize, {
  classNames: ["canvas-preview"],

  /** @type {Boolean} whether to show play button */
  playable: true,

  /** @type {Number} Width of the source video */
  sourceWidth: 640,

  /** @type {Number} Height of the source video */
  sourceHeight: 640,

  /** @type {Number} Frames per second of source video */
  framerate: 23.976,

  /** @type {Number} Frame number to render when stopped */
  initialFrame: 233,

  /** @type {Boolean} Video is stopped and loaded */
  canPlay: Ember.computed.and("isLoaded","isStopped"),

  /** @type {Boolean} */
  isLoaded: Ember.computed.and("rawFramesReady","audioReady","overlayReady","jsonReady"),

  /** @type {Boolean} */
  isLoading: Ember.computed.not("isLoaded"),

  /** @type {Boolean} */
  isPlaying: false,

  /** @type {Boolean} */
  isStopped: Ember.computed.not("isPlaying"),

  /** Path to scene assets */
  scenePath: function() {
    return "/scenes/"+this.get("scene");
  }.property("scene"),

  //----------------------------------
  // AUDIO
  // ---------------------------------
  
  /** Path to scene's audio track */
  songPath: function() { return ENV.assetEndpoint+this.get("scenePath") + "/song.mp3"; }.property("scenePath"),

  /** Initiates observer to track state of <audio> element */
  _observeAudioReadines: function() {
    this.$("audio")[0].oncanplaythrough = function(){ this.set("audioReady", true); }.bind(this);
  }.on("didInsertElement"),

  /** Reload the song when component first inserted and whenver the song changes */
  _reloadSong: function() {
    this.set("audioReady", false);
    Ember.run.scheduleOnce("afterRender", this, function() {
      this.$("audio")[0].load();
    });
  }.observes("songPath").on("didInsertElement"),

  /**
   * Teardown audio when scene changes
   */
  _teardownAudio: function() {
    this.$("audio")[0].pause();
    this.$("audio")[0].currentTime = 0;
  }.observes("scene"),

  //----------------------------------
  // JSON
  // ---------------------------------
  
  framesJsonPath: function() { return ENV.assetEndpoint+this.get("scenePath") + "/frames.json"; }.property("scenePath"),
  framesZipPath: function() { return ENV.assetEndpoint+this.get("scenePath") + "/small.zip"; }.property("scenePath"),

  /**
   * Load JSON file
   * The JSON file contains frame data for positioning user uploaded content 
   */
  _loadJSON: function() {
    this.set("jsonReady", false);
    if(!this.get("framesJsonPath")) return;

    $.getJSON(this.get("framesJsonPath")).then(function(json){
      this.set("rawJSON", json);
      this.set("jsonReady", true);
    }.bind(this));
  }.observes("framesJsonPath").on("didInsertElement"),

  //----------------------------------
  // ZIP
  // ---------------------------------
  
  /**
   * Load ZIP.
   * The ZIP is an uncompressed archive containing each individual frame as an image
   */
  _loadZip: function() {
    this.set("rawFramesReady", false);
    this.set("rawFrames", Ember.A());
    var xhr = new XMLHttpRequest();
     
    xhr.addEventListener('load', function(){
      if (xhr.status == 200){
        window.res = xhr.response;
        this.set("rawZipBlob", xhr.response);
      } else {
        this.set("isError");
      }
    }.bind(this));
     
    xhr.open('GET', this.get("framesZipPath"));
    xhr.responseType = 'blob';
    xhr.send(null);
  }.observes("framesZipPath").on("didInsertElement"),

  /**
   * Process the zip and create a BlobReader so we can read out frames when playing
   */
  _readZip: function() {
    if(this.get("rawZipBlob")) {
      zip.createReader(new zip.BlobReader(this.get("rawZipBlob")), function(reader){

        reader.getEntries(function(entries){
          this.set("rawFrames", entries);
          this.set("rawFramesReady", true);
        }.bind(this));

      }.bind(this), function(error) {
        this.set("isError", error);
      }.bind(this));
    }

    window._t = this;
    window.res = this.restart;
  }.observes("rawZipBlob"),

  //----------------------------------
  // OVERLAY
  // ---------------------------------
  
  /**
   * The overlay image is the user-generated image to be tracked with the video
   */
  _loadOverlayImage: function() {
    this.set("overlayReady", false);
    if(!this.get("image")) return;

    var img = new Image();
    img.onload = function() {
      this.set("overlay", img);
      this.set("overlayReady", true);
    }.bind(this);
    img.src = this.get("image");
  }.observes("image").on("didInsertElement"),

  
  // ---------------------------------
  // PLAY/PAUSE/START/ANIMATE!
  // ---------------------------------

  /** Reset playhead and start video+audio */
  restart: function() {
    if(this.get("canPlay")) {
      this.$("audio")[0].pause();
      this.$("audio")[0].currentTime = 0;
      this.startAudio();

      this.set("lastFrameRendered", null); 
      this.startVideo();
    }   
  },

  /** Start video at current frame */
  startVideo: function() {
    var canvas = this.$("canvas");
    this.set("ctx", canvas[0].getContext('2d'));
    this.set("writer", new zip.BlobWriter("image/png"));
    this.set("startTime", Date.now());
    this.set("isPlaying", true);
    
    this.renderFrame();
  },

  /** Start audio at current time */
  startAudio: function() {
    this.$("audio")[0].play();
  },

  /** @type {Number} Tracks current video frame */
  currentFrame: 0,

  /**
   * The brains of the operation.
   * Need to track time, positioning, then draw out image and video frame
   */
  renderFrame: function(_frameNumber) {
    var ctx = this.get("ctx"); // canvas context
    var img = new Image();
    var timeElapsed = (Date.now() - this.get("startTime"));

    // calculate frame number and make sure we're not out of frames
    var frameNumber = _frameNumber || parseInt(timeElapsed / (1000/this.get("framerate")));
    var frame = this.get("rawFrames").objectAt(frameNumber);
    if(!frame) return this.set("isPlaying", false);

    // calculate canvas scale relative to source material
    var canvasWidth = this.get("width");
    var canvasHeight = this.get("height");
    var scaleX = canvasWidth / this.get("sourceWidth");
    var scaleY = canvasHeight / this.get("sourceHeight");

    // Don't need to render the same frame twice. 
    if(frameNumber == this.get("lastFrameRendered")) return window.requestAnimationFrame(function() { this.renderFrame(); }.bind(this));

    var jsonData = this.get("rawJSON")[frameNumber];

    img.onload = function() { // wait to draw canvas until current frame is loaded
      ctx.clearRect(0,0, canvasWidth, canvasHeight);
    
      // draw head shot
      if(jsonData) {
        var overlay = this.get("overlay"); // overlay image = user generate content

        // calculate positioning for overlay
        var width = overlay.width * (jsonData.scaleX/100.00) * scaleX;
        var height = overlay.height * (jsonData.scaleY/100.00) * scaleY;
        var x = jsonData.x * scaleX; // - (width/2);
        var y = jsonData.y * scaleY; //- (height/2);
        var axisX = width/2;
        var axisY = height/2;

        var angleInRad = rad * jsonData.rotation;
        ctx.translate( x, y );
        ctx.rotate( angleInRad );
        ctx.drawImage( overlay, -axisX, -axisY, width, height );
        ctx.rotate( -angleInRad );
        ctx.translate( -x, -y );
      }

      // draw bg
      ctx.drawImage(img,0,0, canvasWidth, canvasHeight);

      // stop if needed:
      if(!this.get("isPlaying")) return;

      // continue on to next frame
      if(!_frameNumber) {
        this.set("lastFrameRendered", frameNumber);
        window.requestAnimationFrame(function() { this.renderFrame(); }.bind(this));
      }
    }.bind(this);
    
    // get current frame blob, set to img.src
    frame.getData(this.get("writer"), function(blob) {
      var u = URL.createObjectURL(blob);
      img.src = u;
    });
      
  },

  /** Render an initial frame */
  renderInitialFrame: function() {
    if(this.get("canPlay")) {
      this.set("writer", new zip.BlobWriter("image/png"));
      var canvas = this.$("canvas");
      this.set("ctx", canvas[0].getContext('2d'));
      this.set("lastFrameRendered", null);
      this.renderFrame(this.get("initialFrame")); // render a random frame 5 seconds in
    }
  }.observes("canPlay", "width", "height"),

  /**
   * Since <canvas> elem requires width and height as px, 
   * we need to track container size and set our <canvas> size manually
   */
  _setCanvasSize: function() {
    var canvasWidth = this.$().width();
    var canvasHeight = this.$().height();

    // make sure we maintain aspect ratio:
    var ratio = (canvasHeight)/(canvasWidth);
    var sourceRatio = this.get("sourceHeight")/this.get("sourceWidth");

    if(ratio > sourceRatio)  {
      // elem is taller then source, shrink height
      canvasHeight = canvasWidth * sourceRatio;
    }
    if(ratio < sourceRatio) {
      // elem is wider then source, shrink width
      canvasWidth = canvasHeight / sourceRatio;
    }

    this.set("width", canvasWidth);
    this.set("height", canvasHeight);
  }.on("didInsertElement", "resize"),

  //--------------------------------------------
  // PREVIEWS
  // ------------------------------------------
  
  /**
   * Start preview on mouse hover
   */
  startPreview: function() {
    if(this.get("previewHover")) {
      this.set("isPreviewing", true);
      this.startVideo();
    }
  }.on("mouseEnter"),

  /**
   * Pause preview on mouse exit
   */
  stopPreview: function() {
    if(this.get("previewHover") && this.get("isPreviewing")) {
      this.set("isPreviewing", false);
      this.set("isPlaying", false);
    }
  }.on("mouseLeave"),


  actions: {
    restart: function() { this.restart(); }
  }

});
