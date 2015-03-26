/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'decent-twerk-web',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        'ember-htmlbars': true,
        "ember-htmlbars-block-params": true,
        "ember-routing-transitioning-classes": true,
        "ember-htmlbars-inline-if-helper": true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    API_ENDPOINT: "//decentxmas.com",

    awsBucket: "mad-decent-twerkshop-videos",
    awsBucketEndpoint: "//mad-decent-twerkshop-videos.s3.amazonaws.com",
    assetEndpoint: "//s3.amazonaws.com/mad-decent-twerkshop",

    cloudinary: {
      cloudName: "conrad-personal",
      apiKey: "187814196291842",
      apiHost: "//api.cloudinary.com/v1_1/",
      imageHost: "//res.cloudinary.com/conrad-personal/image/upload/",
      uploadPreset: "ltvgd0tm"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.assetEndpoint = "";
    ENV.API_ENDPOINT = "//192.168.1.91:3000";
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
