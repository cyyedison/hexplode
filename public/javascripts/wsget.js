function init() {
	//console.log('Init Game');
	turn = 1;
	currPlayer = 1;
	explodequeue = [];
	document.getElementById('currTurn').textContent = turn;
	document.getElementById('currPlayer').textContent = currPlayer;
	if (maxPlayerNum == 1) {
		singlePlayer = true;
		maxPlayerNum = 2;
	}

	mapGenerate();
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

socket.on('hexagonClicked', function(hexId) {
	add(hexId)
} );

socket.on('getInitInfo', function(initInfo) {
	if (Object.keys(initInfo).length > 1) {
		mapSize = initInfo['mapSize'];
		maxPlayerNum = initInfo['NoOfPlayer'];
	} else {
		mapSize = localStorage.getItem('mapSize');
		maxPlayerNum = localStorage.getItem('NoOfPlayer');
	}
	localStorage.setItem('playerId', initInfo['playerId']);

	init();
} );

socket.on('retrieveInitInfo', function(newUser) {
	newUser['mapSize'] = localStorage.getItem('mapSize');
	newUser['NoOfPlayer'] = localStorage.getItem('NoOfPlayer');
	socket.emit('retrieveInitInfo', newUser);
} );

socket.on('updated', function(content) {
	console.log("HI");
	console.log(content);
	console.log(ab2str(content));
} );

joinGame();

