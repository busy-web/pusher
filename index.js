/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');

module.exports = {
  name: 'busy-pusher',

  included(app) {
    this._super.included(app);

		// see: https://github.com/ember-cli/ember-cli/issues/3718
		while (typeof app.import !== 'function' && app.app) {
			app = app.app;
		}

		this.app = app;
		this.importBrowserDeps(app);
  },

	importBrowserDeps(app) {
		var vendor = this.treePaths.vendor;

    app.import(vendor + '/pusher/pusher.js', {prepend: true});
	},

	treeForVendor(vendorTree) {
		var trees = [];

		if (vendorTree) {
			trees.push(vendorTree);
		}

		var pusherPath = path.dirname(require.resolve('pusher-js'));

		trees.push(new Funnel(pusherPath, {
			destDir: 'pusher',
			include: [new RegExp(/\.js$/)]
		}));


		return mergeTrees(trees);
	}
};
