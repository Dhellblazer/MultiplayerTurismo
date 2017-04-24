//----------------Funciona Perfectamente
var socket = require('socket.io');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var players = [];

function SloppyPlayer (id,x,y,z,entity) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.entity = null;
}

io.sockets.on('connection', function(socket) {
    socket.on ('initialize', function () {
            var idNum = players.length;
            var newPlayer = new SloppyPlayer (idNum);
            players.push (newPlayer);

            socket.emit ('playerData', {id: idNum, players: players});
            socket.broadcast.emit ('playerJoined', newPlayer);
    });

    socket.on ('positionUpdate', function (data) {
            players[data.id].x = data.x;
            players[data.id].y = data.y;
            players[data.id].z = data.z;

        socket.broadcast.emit ('playerMoved', data);
    });
});

console.log ('Server started.');
server.listen(process.env.PORT || 3000);
