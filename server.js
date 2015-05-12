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
	res.sendFile(__dirname + '/views/ranking.html');
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
		if (roomWithPlayer[playerAtRoom[socket.id]]) {
			var playerId = roomWithPlayer[playerAtRoom[socket.id]].length;
			newUser['id'] = socket.id;
			newUser['playerId'] = playerId;
			console.log('New user get init information');
			if (Object.keys(io.nsps['/'].adapter.rooms[playerAtRoom[socket.id]]).length > 1) {
				io.to(Object.keys(io.nsps['/'].adapter.rooms[playerAtRoom[socket.id]])[0]).emit('retrieveInitInfo', newUser);
			} else {
				io.to(socket.id).emit('getInitInfo', {'playerId' : playerId});
			}
		}
	} );
	socket.on('getRank', function() {
		//console.log(turn);
		var fs = require("fs");
		var content = fs.readFileSync(__dirname + '/public/db/rank.txt');	
		var content2 = JSON.stringify(content);
		var splitted = content2.split(",10,");//splitted is array of all record, e.g. alice, 100, in ascii
		//console.log("Contents: " + content2);
		var splitted2;
		var record=[];
		var string;
		for (var u=0; u < splitted.length ;u++){
			splitted[u] = splitted[u].replace('[','');
			splitted[u] = splitted[u].replace(']','');//remove the head and tail [ and ]
			splitted2 = splitted[u].split(","); //splitted2 is one single record, e.g. alice, 100, in ascii			
			string = String.fromCharCode.apply(this, splitted2);
			record[u] = string;
			record[u] = record[u].split(",");
			console.log("name: "+record[u][0]+" turn: "+record[u][1]);
		}
		socket.emit('pushRank', record);	
		

	} );
	socket.on('updateRank', function(turn) {
		console.log("updateRank");
		//console.log(turn);
		var fs = require("fs");
		var content = fs.readFileSync(__dirname + '/public/db/rank.txt');	
		var content2 = JSON.stringify(content);
		var splitted = content2.split(",10,");//splitted is array of all record, e.g. alice, 100, in ascii
		//console.log("Contents: " + content2);
		var splitted2;
		var record=[];
		var string;
		var d;
		for (var u=0; u < splitted.length ;u++){
			splitted[u] = splitted[u].replace('[','');
			splitted[u] = splitted[u].replace(']','');//remove the head and tail [ and ]
			splitted2 = splitted[u].split(","); //splitted2 is one single record, e.g. alice, 100, in ascii			
			string = String.fromCharCode.apply(this, splitted2);
			record[u] = string;
			record[u] = record[u].split(",");
			//console.log("name: "+record[u][0]+" turn: "+record[u][1]);
		}
		for (d=9;d>=0;d--){
			if (turn <= record[d][1]){
				if (d==9)
					continue;
				record[d+1][0]=record[d][0];
				record[d+1][1]=record[d][1];
			}
			else break;
		}
		if (d+1<=9){
			console.log("You are in ranking!");
			record[d+1][1]=turn;
			socket.emit('requestName', {});
			socket.on('gotName', function(name) {
				record[d+1][0]=name;
				console.log("record: "+record);
			});
			
		}
		//console.log("record: "+record);
		

	} );
	socket.on( 'retrieveInitInfo', function(newUser) {
		console.log('New user retrieve init information');
		io.to(newUser['id']).emit('getInitInfo', {'NoOfPlayer' : newUser['NoOfPlayer'], 'mapSize' : newUser['mapSize'], 'playerId' : newUser['playerId']});
	} );
} );

