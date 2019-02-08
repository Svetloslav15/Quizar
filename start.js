let env = process.env.NODE_ENV || 'development';
const socket = require('socket.io');

let settings = require('./config/settings')[env];

const app = require('express')();

require('./config/database')(settings);
require('./config/express')(app);
require('./routes/index')(app);
require('./config/passport')();

const server = app.listen(settings.port);
const io = socket(server);

io.on("connection", function (socket) {
    socket.on('message', function (data) {
        socket.broadcast.emit("message", data);
    });
});
console.log(`Server listening on port ${settings.port}...`);