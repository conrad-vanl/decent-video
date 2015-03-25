import env from '../config/environment';

/**
 * Initialize cloudinary
 * As per http://cloudinary.com/documentation/jquery_integration#configuration
 */
export function initialize() {
  $.cloudinary.config({ cloud_name: env.cloudinary.cloudName, api_key: env.cloudinary.apiKey});
}

export default {
  name: 'cloudinary',
  initialize: initialize
};
