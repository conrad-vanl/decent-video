import Ember from 'ember';
import ENV from "../config/environment";
import Resize from "../mixins/resize";
var rad = Math.PI / 180;

export default Ember.Component.extend(Resize, {
  classNames: ["canvas-preview"],

  scale: 1,

  playable: true,

  sourceWidth: 640,
  sourceHeight: 640,

  scenePath: function() {
    return "/scenes/"+this.get("scene");
  }.property("scene"),

  // audio
  _observeAudioReadines: function() {
    this.$("audio")[0].oncanplaythrough = function(){ this.set("audioReady", true); }.bind(this);
  }.on("didInsertElement"),

  songPath: function() { return ENV.assetEndpoint+this.get("scenePath") + "/song.mp3"; }.property("scenePath"),
  _reloadSong: function() {
    this.set("audioReady", false);
    Ember.run.scheduleOnce("afterRender", this, function() {
      this.$("audio")[0].load();
    });
  }.observes("songPath").on("didInsertElement"),

  framesJsonPath: function() { return ENV.assetEndpoint+this.get("scenePath") + "/frames.json"; }.property("scenePath"),
  framesZipPath: function() { return ENV.assetEndpoint+this.get("scenePath") + "/small.zip"; }.property("scenePath"),

  _teardown: function() {
    this.$("audio")[0].pause();
    this.$("audio")[0].currentTime = 0;
  }.observes("scene"),

  _loadJSON: function() {
    this.set("jsonReady", false);
    if(!this.get("framesJsonPath")) return;

    $.getJSON(this.get("framesJsonPath")).then(function(json){
      this.set("rawJSON", json);
      this.set("jsonReady", true);
    }.bind(this));
  }.observes("framesJsonPath").on("didInsertElement"),

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

  canPlay: Ember.computed.and("isLoaded","isStopped"),

  isLoaded: Ember.computed.and("rawFramesReady","audioReady","overlayReady","jsonReady"),
  isLoading: Ember.computed.not("isLoaded"),

  isPlaying: false,
  isStopped: Ember.computed.not("isPlaying"),

  restart: function() {
    if(this.get("canPlay")) {
      this.$("audio")[0].pause();
      this.$("audio")[0].currentTime = 0;
      this.startAudio();

      this.set("lastFrameRendered", null); 
      this.startVideo();
    }   
    if(ga && typeof(ga) == "function") {
      ga('send', 'event', 'video:play', this.get("scene"), this.get("image")); 
    } 
  },

  startVideo: function() {
    var canvas = this.$("canvas");
    this.set("ctx", canvas[0].getContext('2d'));
    this.set("writer", new zip.BlobWriter("image/png"));
    this.set("startTime", Date.now());
    this.set("isPlaying", true);
    
    this.renderFrame();
  },

  startAudio: function() {
    this.$("audio")[0].play();
  },

  currentFrame: 0,

  renderFrame: function(_frameNumber) {
    var ctx = this.get("ctx");
    var img = new Image();
    var timeElapsed = (Date.now() - this.get("startTime"));

    var frameNumber = _frameNumber || parseInt(timeElapsed / (1000/23.976));
    var frame = this.get("rawFrames").objectAt(frameNumber);
    if(!frame) return this.set("isPlaying", false);

    var canvasWidth = this.get("width");
    var canvasHeight = this.get("height");

    var scaleX = canvasWidth / this.get("sourceWidth");
    var scaleY = canvasHeight / this.get("sourceHeight");

    if(frameNumber == this.get("lastFrameRendered")) return window.requestAnimationFrame(function() { this.renderFrame(); }.bind(this));

    var jsonData = this.get("rawJSON")[frameNumber];

    img.onload = function() {
      ctx.clearRect(0,0, canvasWidth, canvasHeight);
    
      // draw head shot
      if(jsonData) {
        var overlay = this.get("overlay");

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

      if(!_frameNumber) {
        this.set("lastFrameRendered", frameNumber);
        window.requestAnimationFrame(function() { this.renderFrame(); }.bind(this));
      }
    }.bind(this);
    
    frame.getData(this.get("writer"), function(blob) {
      var u = URL.createObjectURL(blob);
      img.src = u;
    });
      
  },

  renderInitialFrame: function() {
    if(this.get("canPlay")) {
      this.set("writer", new zip.BlobWriter("image/png"));
      var canvas = this.$("canvas");
      this.set("ctx", canvas[0].getContext('2d'));
      this.set("lastFrameRendered", null);
      this.renderFrame(100); // render a random frame 5 seconds in
    }
  }.observes("canPlay", "width", "height"),

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

  startPreview: function() {
    if(this.get("previewHover")) {
      this.set("isPreviewing", true);
      this.startVideo();
    }
  }.on("mouseEnter"),

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
