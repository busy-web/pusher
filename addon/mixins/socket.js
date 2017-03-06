/**
 * @module Mixins
 *
 */
import Ember from 'ember';
import { Assert } from 'busy-utils';
import socket from 'busy-pusher/socket';

/**
 * `Mixin/Socket`
 *
 * This mixin is intended to work with `Service/Store`.
 *
 * In order to use this mixin `ember g service store`, and
 * in `app/services/store' you can import the mixin like `import SocketMixin from 'busy-pusher/mixins/socket';`
 * then add the mixin to `export default Ember.Service.extend(SocketMixin, {`.
 *
 * Then calls can be made with `this.store.querySocket`.
 *
 * @class Socket
 * @namespace Mixins
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
	/**
	 * Makes a model query with a socket listener attached
	 *
	 * @public
	 * @method querySocket
	 * @param modelType {string} The model to queary and the socket channel name
	 * @param eventType {string} The socket event to listen for
	 * @param query {object} The model queary params
	 * @returns {Socket}
	 */
	querySocket(modelType, channelType, eventType, query) {
		Assert.funcNumArgs(arguments, 4, true);
		Assert.isString(modelType);
		Assert.isString(eventType);
		Assert.isObject(query);

		return socket.create(this, modelType, channelType, eventType, query);
	},

	/**
	 * Makes a findRecord call with a socket listener attached
	 *
	 * @public
	 * @method findRecordSocket
	 * @param modelType {string} The model to queary and the socket channel name
	 * @param eventType {string} The socket event to listen for
	 * @param id {string} The model id
	 * @returns {Socket}
	 */
	findRecordSocket(modelType, channelType, eventType, id) {
		Assert.funcNumArgs(arguments, 4, true);
		Assert.isString(modelType);
		Assert.isString(eventType);
		Assert.isString(id);

		return socket.create(this, modelType, channelType, eventType, id);
	}
});
