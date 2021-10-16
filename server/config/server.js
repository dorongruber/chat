const app = require('../../app');
const http = require('http');

const server = http.createServer(app);

const io = require('./socketio').init(server);
// init socketio
require('../api/socketio')(io);
//init mongodb
require('./mongodb');

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('listening at port ' + PORT));
