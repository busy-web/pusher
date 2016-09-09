import Ember from 'ember';
import SocketMixin from 'busy-pusher/mixins/socket';
import { module, test } from 'qunit';

module('Unit | Mixin | socket');

// Replace this with your real tests.
test('it works', function(assert) {
  let SocketObject = Ember.Object.extend(SocketMixin);
  let subject = SocketObject.create();
  assert.ok(subject);
});
