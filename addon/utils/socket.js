/* globals BusyPusher */
/**
 * @module Utils
 *
 */
import Ember from 'ember';
import Time from 'busy-utils/utils/time';
import UUID from 'busy-utils/utils/uuid';
import assert from 'busy-utils/utils/assert';
import pusher from 'pusher';

/**
 * `Util/Socket`
 *
 * @class Socket
 * @namespace Utils
 * @extends Ember.Object
 */
const Socket = Ember.Object.extend(Ember.Evented, {
	type: null,
	modelType: null,
	eventType: null,
	queryParams: null,
	channel: null,

	lastSync: null,
	syncTime: null,

	_lastModelState: null,

	/**
	 * initializer function
	 *
	 * @private
	 * @method init
	 */
	init() {
		if (BusyPusher.DEBUG_MODE) {
			this.set('_debugKey', UUID.generate());
		}

		this._super();
	},

	/**
	 * Makes a query get call to the api and watches it from a pusher socket.
	 *
	 * @public
	 * @chainable
	 * @method query
	 * @param modelType {string} The model type to get
	 * @param query {object} The params for the get call
	 * @return {Socket}
	 */
	query(modelType, query) {
		this.store.query(modelType, query).then(res => {
			this.sync(res);
		}).catch(err => this.error(err));

		return this;
	},

	/**
	 * Makes a query get call to find a record from the api and watches it from a pusher socket.
	 *
	 * @public
	 * @chainable
	 * @method query
	 * @param modelType {string} The model type to get
	 * @param id {object} The model id to get
	 * @return {Socket}
	 */
	findRecord(modelType, id) {
		this.store.query(modelType, id).then(res => {
			this.sync(res);
		}).catch(err => this.error(err));

		return this;
	},

	/**
	 * Callback promise listener for successfull calls
	 *
	 * @public
	 * @chainable
	 * @method then
	 * @param callback {function} The callback method
	 * @return {Socket}
	 */
	then(callback) {
		this.on('sync', callback);
		return this;
	},

	/**
	 * Callback promise listener for error calls
	 *
	 * @public
	 * @chainable
	 * @method catch
	 * @param callback {function} The callback method
	 * @return {Socket}
	 */
	catch(callback) {
		this.on('error', callback);
		return this;
	},

	/**
	 * Updates the models after calling query or findRecord again
	 *
	 * @public
	 * @chainable
	 * @method update
	 * @return {Socket}
	 */
	update() {
		var method = this.get('type');
		var modelType = this.get('modelType');
		var query = this.get('queryParams');

		return this[method].call(this, modelType, query);
	},

	/**
	 * Internal sync trigger for updating then and catch methods
	 *
	 * @private
	 * @method sync
	 * @param {data} Api returned model data
	 */
	sync(data) {
		this.set('lastSync', Time.timestamp());
		this.set('_lastModelState', data);
		this.trigger('sync', data, this);
	},

	/**
	 * Error handler method for triggering error events
	 *
	 * @private
	 * @method error
	 * @param err {object}
	 */
	error(err) {
		window.console.log('error', err);
		this.trigger('error', err, this);
	},

	/**
	 * Destroys the event listener so it will no longer update
	 *
	 * @public
	 * @method destroy
	 */
	destroy() {
		if(!Ember.isNone(this.get('channel')) && !Ember.isNone(this.get('eventType'))) {
			// unbind current events
			this.get('channel').unbind(this.get('eventType'));
		}
	}
});

Socket.reopenClass({

	_create: Socket.create,

	/**
	 * create class override
	 */
	create(store, modelType, eventType, query) {
		assert.funcNumArgs(arguments, 4);
		assert.isObject(store);
		assert.isString(modelType);
		assert.isString(eventType);

		const owner = Ember.getOwner(store);
		const socket = this._create(owner.ownerInjection());

		socket.store = store;
		socket.set('modelType', modelType);
		socket.set('eventType', eventType);
		socket.set('queryParams', query);

		if (typeof query === 'string') {
			socket.set('type', 'findRecord');
		} else {
			socket.set('type', 'query');
		}

		// TODO:
		// channel type needs to be set to modelType
		let channel = pusher.channel('test_channel');
		if(!channel) {
			// set channel
			channel = pusher.subscribe('test_channel');

			// handle connect success
			channel.bind('pusher:subscription_succeeded', () => {
				socket.update();
			});

			// handle connection error
			channel.bind('pusher:subscription_error', status => {
				socket.error(status);
			});
		} else {
			// unbind current events
			channel.unbind(eventType);

			// reload data
			socket.update();
		}

		socket.set('channel', channel);

		// bind to event
		channel.bind(eventType, socket.update, socket);
		return socket;
	}
});

export default Socket;
