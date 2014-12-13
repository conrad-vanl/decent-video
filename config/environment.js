/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'xmas-twerk-web',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        'ember-htmlbars': true
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    API_ENDPOINT: "//mad-decent-elf-twerk.herokuapp.com",

    contentSecurityPolicyHeader: "Content-Security-Policy",
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-eval' 'unsafe-inline' use.typekit.net 192.168.1.91:35771 api.filepicker.io 192.168.1.91:35729 cdn.clappr.io",
      'font-src': "'self' fontastic.s3.amazonaws.com cdn.clappr.io 'unsafe-inline' *",
      'connect-src': "'self' ws://192.168.1.91:35729 ws://192.168.1.91:35771 *.filepicker.io https://mad-decent-xmas-twerk.s3.amazonaws.com mad-decent-elf-twerk.herokuapp.com https://www.filepicker.io data:",
      'img-src': "*",
      'style-src': "'self' 'unsafe-inline' fontastic.s3.amazonaws.com use.typekit.net",
      'frame-src': "'self' *",
      'media-src': "'self' *"
    },

    awsBucket: "mad-decent-twerkshop-videos",
    awsBucketEndpoint: "//mad-decent-twerkshop-videos.s3.amazonaws.com/"
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'auto';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
