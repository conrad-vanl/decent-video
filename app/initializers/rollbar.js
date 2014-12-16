import ENV from "../config/environment";

export function initialize(container, application) {
  if(typeof(Rollbar) == "undefined") return;
  Rollbar.configure({
    payload: {
      environment: ENV.environment
    }
  });

  //disable on development:
  if(ENV.environment == "development") {
    Rollbar.configure({enabled: false});
  
  } else {

    var reportError = Rollbar.error;

    // Trap exceptions from within Ember run loop
    Ember.onerror = reportError;

    // Trap unhandled RSVP promise failures
    Ember.RSVP.configure('onerror', reportError);

    // Safety net to report any untrapped exceptions on browsers
    // that respect window.onerror.  Currently, failures from within 
    // Backburner callbacks will end up here. This is inferior to the 
    // other handlers because the stack trace is missing by the 
    // time the exception gets here.
    window.onerror = reportError;
  }
};

export default {
  name: 'rollbar',
  initialize: initialize
};
