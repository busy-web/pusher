//import Pusher from 'pusher';

export function initialize(app) {
  console.log(app);

  const BusyPusher = app;
  window.BusyPusher = BusyPusher;
}

export default {
  name: 'busy-pusher',
  initialize
};
