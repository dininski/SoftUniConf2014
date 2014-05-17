'use strict';

var http = require('http');

var express = require('express');
var app = express();

var WebSocketServer = require('ws').Server;

var server = http.createServer(app);

app.use('/', express.static(__dirname + '/static'));

var wss = new WebSocketServer({server: server});

var helloMessage = {
    name: "System",
    message: "Hello!"
};

wss.on('connection', function (socket) {
    socket.send(JSON.stringify(helloMessage));
    socket.on('message', function (msg) {
        var processedMessage = escapeMessage(msg);
        wss.broadcast(processedMessage);
    })
});

wss.broadcast = function (data) {
    for (var i in this.clients)
        this.clients[i].send(data);
};

function escapeMessage(msg) {
    return msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

server.listen(8080);


