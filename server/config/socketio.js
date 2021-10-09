let io;

module.exports = {
    init: httpServer => {
      io = require('socket.io')(httpServer, {
        cors:{
          origin: process.env.CLIENT_URL,
          methods: ["GET", "POST"],}
      });
      return io;
    },
    getIO: () => {
      if (!io) {
        throw new Error('socket.io not initialized');
      }
      return io;
    }
}
