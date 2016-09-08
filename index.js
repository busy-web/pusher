/* jshint node: true */
'use strict';

module.exports = {
  name: 'busy-pusher',

  included(app) {
    this._super.included(app);

    this.app.import('bower_components/pusher-websocket-iso/dist/web/pusher.js', {
      type: 'vendor'
    });
  }
};
