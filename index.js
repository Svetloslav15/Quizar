let env = process.env.NODE_ENV || 'development';
const socket = require('socket.io');

let settings = require('./server/config/settings')[env];

const app = require('express')();

require('./server/config/database')(settings);
require('./server/config/express')(app);
require('./server/config/routes')(app);
require('./server/config/passport')();

const server = app.listen(settings.port);
const io = socket(server);

io.on("connection", function (socket) {
    socket.on('message', function (data) {
        socket.broadcast.emit("message", data);
    });

    socket.on("typing", function (data) {
        socket.broadcast.emit('typing', data);
    });
});
console.log(`Server listening on port ${settings.port}...`);