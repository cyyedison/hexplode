var express = require( 'express' );
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '192.168.122.221';

var sessionId = 0;
var roomId;
var roomlist = {};

app.get( '/', function ( req, res ) {
	res.redirect('/session/' + sessionId);
	sessionId++;
} );

app.get( '/session/:id([0-9]+)', function ( req, res ) {
	roomId = req.params.id;
	res.sendFile(__dirname + '/views/playerpage.html');
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

var http = require( 'http' );

var io = require( 'socket.io' )( server );
io.on( 'connection', function( socket ) {
	socket.join(roomId, function() {
		roomlist[socket.id] = roomId;
//		console.log( 'Room and roommate ' + JSON.stringify(roomlist) );
		roomId = null;
	} );
	console.log( 'New user connected: ' + socket.id );
	socket.on( 'disconnect', function() {
//		console.log( 'User disconnected' );
		delete roomlist[socket.id];
	} );
	socket.on( 'getPlaylist', function(newUser) {
		newUser['id'] = socket.id;
		console.log( 'New user get playlist: ' + newUser['id'] );
		if (Object.keys(io.nsps['/'].adapter.rooms[roomlist[socket.id]]).length > 1) {
			io.to(Object.keys(io.nsps['/'].adapter.rooms[roomlist[socket.id]])[0]).emit('retrievePlaylist', newUser);
		} else {
			io.to(socket.id).emit('getPlaylist', null);
		}
	} );
	socket.on( 'retrievePlaylist', function(newUser) {
		console.log( 'New user retrieve playlist: ' + newUser['id'] );
		io.to(newUser['id']).emit('getPlaylist', {'playlist' : newUser['playlist'], 'title' : newUser['title']});
	} );
	socket.on('hexagonClicked', function(hexId) {
		io.to(roomlist[socket.id]).emit('hexagonClicked', hexId);
	} );
} );
