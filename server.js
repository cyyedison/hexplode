var express = require('express');
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '192.168.122.221';

var sessionId = 0;
var roomId;
var playerAtRoom = {};
var roomWithPlayer = {};

app.get( '/', function ( req, res ) {
	res.redirect('/menu');
} );

app.get( '/help', function ( req, res ) {
	res.sendFile(__dirname + '/views/help.html');
} );

app.get( '/menu', function ( req, res ) {
	res.sendFile(__dirname + '/views/index.html');
} );

app.get( '/play', function ( req, res ) {
	res.redirect('/play/' + sessionId);
	sessionId++;
} );

app.get( '/rank', function ( req, res ) {
	res.sendFile(__dirname + '/views/updaterank.php');
} );

app.get('/play/:id([0-9]+)', function (req, res) {
	roomId = req.params.id;
	res.sendFile(__dirname + '/views/play.html');
} );

app.get(function(req, res){
	res.render(__dirname + '/views/error.jade');
});

app.use( express.static( __dirname + '/public' ) );

var server = app.listen( server_port, server_ip_address, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log( 'Listening at http://%s:%s', host, port );
} );

var io = require('socket.io')(server);
io.on('connection', function(socket) {
	if (roomId) {
		socket.join(roomId, function() {
			playerAtRoom[socket.id] = roomId;
			if (!roomWithPlayer[roomId.toString()]) {
				roomWithPlayer[roomId.toString()] = [];
			}
			roomWithPlayer[roomId.toString()].push(socket.id);
			console.log( 'Room and roommate ' + JSON.stringify(roomWithPlayer) );
			roomId = null;
		} );
	}
	console.log('New user connected');
	socket.on( 'disconnect', function() {
//		console.log( 'User disconnected' );
		for (var i in roomWithPlayer[playerAtRoom[socket.id]]) {
			if (roomWithPlayer[playerAtRoom[socket.id]][i] == socket.id) {
				roomWithPlayer[playerAtRoom[socket.id]].splice(i, 1);
			}
		}
		delete playerAtRoom[socket.id];
	} );
	socket.on('hexagonClicked', function(hexId) {
		io.to(playerAtRoom[socket.id]).emit('hexagonClicked', hexId);
	} );
	
	socket.on( 'getInitInfo', function(newUser) {
		var playerId = roomWithPlayer[playerAtRoom[socket.id]].length;
		newUser['id'] = socket.id;
		newUser['playerId'] = playerId;
		console.log('New user get init information');
		if (Object.keys(io.nsps['/'].adapter.rooms[playerAtRoom[socket.id]]).length > 1) {
			io.to(Object.keys(io.nsps['/'].adapter.rooms[playerAtRoom[socket.id]])[0]).emit('retrieveInitInfo', newUser);
		} else {
			io.to(socket.id).emit('getInitInfo', {'playerId' : playerId});
		}
	} );
	socket.on('updateInfo', function(turn) {
		console.log(turn);
		socket.emit('updated', content);
		var fs = require("fs");
		var content = fs.readFileSync("./public/db/rank.txt");	
		socket.emit('updated', content);	
		console.log("Contents: " + content);
	} );
	socket.on( 'retrieveInitInfo', function(newUser) {
		console.log('New user retrieve init information');
		io.to(newUser['id']).emit('getInitInfo', {'NoOfPlayer' : newUser['NoOfPlayer'], 'mapSize' : newUser['mapSize'], 'playerId' : newUser['playerId']});
	} );
} );

