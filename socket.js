let io;

module.exports = {
  init: httpServer => {
   // console.log('socket inside called');
    io = require('socket.io')(httpServer);
   // console.log(io);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
