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

function getRank(){
	socket.emit('getRank', {});
}

socket.on('requestName', function() {
	//console.log("gettingName");
	var name = prompt("Please enter your name", "");
	while (name==null)
		name = prompt("Please enter your name", "");
	socket.emit('gotName', name);
} );

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
} );

socket.on('pushRank', function(record) {
	for (var y=0;y<10;y++){
		document.getElementById("ranking").innerHTML+=(y+1);
		document.getElementById("ranking").innerHTML+=": ";
		document.getElementById("ranking").innerHTML+=record[y];
		document.getElementById("ranking").innerHTML+="<br>";
	}
} );


joinGame();

