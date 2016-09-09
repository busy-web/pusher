import Pusher from 'npm:pusher-js';

export function initialize(app) {
  console.log('app', app);

  const BusyPusher = app;

   //if (BusyPusher.SOCKETS) {
     //setup socket listener
     const pusher = new Pusher(BusyPusher.PUSHER_KEY, { cluster: BusyPusher.PUSHER_CLUSTER, encrypted: true });

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

     BusyPusher.pusher = pusher;
   //}

  window.BusyPusher = BusyPusher;
}

export default {
  name: 'busy-pusher',
  initialize
};
