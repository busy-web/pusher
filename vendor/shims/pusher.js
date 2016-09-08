/* globals BusyPusher, define */
(function() {
  function vendorModule() {
    'use strict';

    console.log(window.Pusher);

    if(!window.pusher) {
      //if (BusyPusher.SOCKETS) {
        //setup socket listener
        const pusher = new window.Pusher(BusyPusher.PUSHER_KEY, { cluster: BusyPusher.PUSHER_CLUSTER, encrypted: true });

        // debug socket data
        //if (BusyPusher.DEBUG_MODE) {
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
        //}

        window.pusher = pusher;
      //}
    }

    return { 'default': window.pusher };
  }

  define('pusher', [], vendorModule);
})();
