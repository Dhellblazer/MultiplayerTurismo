//----------------Funciona Perfectamente

var socket = require('socket.io');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var players = [];
var allClients=[];


function Player (id) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.entity = null;
}

io.sockets.on('connection', function(socket) {
	allClients.push(socket);
    socket.on ('initialize', function (data) {
            var idNum = players.length;
            var newPlayer = new Player (idNum);
            players.push (newPlayer);

            socket.emit ('playerData', {id: idNum, players: players});
            socket.broadcast.emit ('playerJoined', newPlayer);
    });

    socket.on ('positionUpdate', function (data) {
        if(!players[data.id].deleted){
	
          players[data.id].x = data.x;
          players[data.id].y = data.y;
          players[data.id].z = data.z;
     
        socket.broadcast.emit ('playerMoved', data);
	}
    });


      socket.on('disconnect', function() {
      
	
	var i = allClients.indexOf(socket);
	
	players[i].deleted=true;
        socket.broadcast.emit ('killPlayer', players[i]);
	


     
   });
});


server.listen(process.env.PORT || 3000);