var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);


var WebSocketServer = require('ws').Server
var webserver = new WebSocketServer({ port:8080 });
var nodeCounter = 0;

webserver.on('connection', function connection(ws) {
  nodeCounter++;
  console.log('a node connected');
  io.sockets.emit('mesh_num_update', nodeCounter)
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    io.sockets.emit('new_http', message);
  });
  ws.on('close', function() {
    nodeCounter--;
    console.log('a node disconnected');
    io.sockets.emit('mesh_num_update', nodeCounter)
  });
});


app.use('/static', express.static('static'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/static/index.html');
});


var clientCounter = 0;

io.on('connection', function(socket){
  clientCounter++;
  console.log('a user connected');
  io.sockets.emit('client_num_update', clientCounter)
  io.sockets.emit('mesh_num_update', nodeCounter)
  socket.on('disconnect', function(){
   clientCounter--; 
   console.log('a user disconnected');
   io.sockets.emit('client_num_update', clientCounter)
})
});





