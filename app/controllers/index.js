import Ember from 'ember';
import env from "../config/environment";

export default Ember.Controller.extend({
  cloudinary: env.cloudinary
});
