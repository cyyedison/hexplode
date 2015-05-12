var socket = io(window.location.hostname + ":8000");

function hexClick(id) {
	var playerId = localStorage.getItem('playerId');
	var currPlayer = parseInt(document.getElementById("currPlayer").textContent);
	if (playerId == currPlayer) {
		socket.emit('hexagonClicked', id);
	} else {
		alert('Please be patient.');
	}
}

function joinGame() {
	socket.emit('getInitInfo', {});
}

function update(){	
	var fs = require("fs");
	var content = fs.readFileSync("../db/rank.txt");
	console.log("Contents: " + content);

}