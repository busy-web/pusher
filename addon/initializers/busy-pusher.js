export function initialize(app) {
  console.log(app);

  const BusyPusher = app;
  window.BusyPusher = BusyPusher;

	//if (BusyApp.SOCKETS) {
		//setup socket listener
		BusyPusher.pusher = new window.Pusher(BusyPusher.PUSHER_KEY, { cluster: BusyPusher.PUSHER_CLUSTER, encrypted: true });

		// debug socket data
		//if (BusyPusher.DEBUG_MODE) {
			/**
			* pusher connected
			*/
			BusyPusher.pusher.connection.bind('connected', function() {
				window.console.log('pusher is connected');
			});

			/**
			* pusher connecting in
			*/
			BusyPusher.pusher.connection.bind('connecting_in', function(delay) {
				window.console.log("I haven't been able to establish a connection for this feature. I will try again in " + delay + " seconds.");
			});

			/**
			* pusher state change
			*/
			BusyPusher.pusher.connection.bind('state_change', function(states) {
				window.console.log('pusher state', states.current);
			});

			/**
			* pusher error handler
			*/
			BusyPusher.pusher.connection.bind('error', function(err) {
				window.console.log('pusher error', err);
			});
		//}
	//}
}

export default {
  name: 'busy-pusher',
  initialize
};
