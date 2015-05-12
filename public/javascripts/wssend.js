var socket = io(window.location.hostname + ":8000");

function hexClick(id) {
	var playerId = localStorage.getItem('playerId');
	var currPlayer = parseInt(document.getElementById("currPlayer").textContent);
	if (playerId == currPlayer) {
		var playerClass = ownerX + playerId;
		var currHexOwner = document.getElementById(id).className;
		if ((currHexOwner != noOwner) && (currHexOwner != playerClass)) {
			alert("You can't select other player's place!");
		} else {
			socket.emit('hexagonClicked', id);
		}
	} else {
		alert('Please be patient.');
	}
}

function joinGame() {
	socket.emit('getInitInfo', {});
}

function update(turn){	
	socket.emit('updateInfo', turn);
	console.log("updating");
}

