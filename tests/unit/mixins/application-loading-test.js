import Ember from 'ember';
import ApplicationLoadingMixin from '../../../mixins/application-loading';
import { module, test } from 'qunit';

module('ApplicationLoadingMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ApplicationLoadingObject = Ember.Object.extend(ApplicationLoadingMixin);
  var subject = ApplicationLoadingObject.create();
  assert.ok(subject);
});
