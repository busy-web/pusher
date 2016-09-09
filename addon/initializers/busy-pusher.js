
export function initialize(app) {
	const BusyPusher = app["busy-pusher"] || {};

	if (BusyPusher.PUBLIC_KEY) {
		const args = {};

		if (BusyPusher.CLUSTER) {
			args.cluster = BusyPusher.PUSHER_CLUSTER;
		}

		if (BusyPusher.ENCRYPTED) {
			args.encrypted = true;
		}

		if (BusyPusher.ENABLED) {
			//setup socket listener
			const pusher = new window.Pusher(BusyPusher.PUBLIC_KEY, args);

			// debug socket data
			if (BusyPusher.DEBUG) {
				/**
				* pusher connected
				*/
				pusher.connection.bind('connected', function() {
					window.console.log('pusher is connected');
				});

				/**
				* pusher connecting in
				*/
				pusher.connection.bind('connecting_in', function(delay) {
					window.console.log("I haven't been able to establish a connection for this feature. I will try again in " + delay + " seconds.");
				});

				/**
				* pusher state change
				*/
				pusher.connection.bind('state_change', function(states) {
					window.console.log('pusher state', states.current);
				});

				/**
				* pusher error handler
				*/
				pusher.connection.bind('error', function(err) {
					window.console.log('pusher error', err);
				});
			}

			BusyPusher.pusher = pusher;
		}
	}

	window.BusyPusher = BusyPusher;
}

export default {
  name: 'busy-pusher',
  initialize
};
