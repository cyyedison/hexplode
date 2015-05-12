var one = "1";
function chooseMapSize(id){
	var mode = document.getElementById("mode");
	mode.innerHTML='';
	var playerMenu = document.getElementById("playerMenu");
	playerMenu.innerHTML='';
	var diffMenu = document.getElementById("diffMenu");
	diffMenu.innerHTML='';
				
	var mapMenu = document.getElementById("mapMenu");
	document.getElementById("instruction").innerHTML="Choose a map size:";
	var ele = document.createElement('div');
	//alert(id);
	if (id=="1")
		ele.innerHTML='<a onClick="setMapSize(3);setNoOfPlayer(1);chooseDifficulty();" class="myButton">3x3</a><br><br><a onClick="setMapSize(4);setNoOfPlayer(1);chooseDifficulty();" class="myButton">4x4</a><br><br><a onClick="setMapSize(5);setNoOfPlayer(1);chooseDifficulty();" class="myButton">5x5</a><br><br><a onClick="restoreMenu()" class="myButton">Back</a>';
	else
		ele.innerHTML='<a onClick="setMapSize(3);choosePlayer();" class="myButton">3x3</a><br><br><a onClick="setMapSize(4);choosePlayer();" class="myButton">4x4</a><br><br><a onClick="setMapSize(5);choosePlayer()" class="myButton">5x5</a><br><br><a onClick="restoreMenu()" class="myButton">Back</a>';
	mapMenu.appendChild(ele);
}

function chooseDifficulty(){
	var mapMenu = document.getElementById("mapMenu");
	mapMenu.innerHTML='';
	
	var diffMenu = document.getElementById("diffMenu");
	document.getElementById("instruction").innerHTML="Choose difficulty:";
	var ele = document.createElement('div');
	
	ele.innerHTML='<a onClick="setDifficulty(1);" href="/play" class="myButton">Easy</a><br><br><a onClick="setDifficulty(2);" href="/play" class="myButton">Hard</a><br><br><a onClick="chooseMapSize(one);" class="myButton">Back</a>';
	diffMenu.appendChild(ele);	
}

function choosePlayer(){				
	var mapMenu = document.getElementById("mapMenu");
	mapMenu.innerHTML='';
	
	var playerMenu = document.getElementById("playerMenu");
	document.getElementById("instruction").innerHTML="Choose the number of players:";
	var ele = document.createElement('div');
	ele.innerHTML='<a onClick="setNoOfPlayer(2)" href="/play" class="myButton">2 players</a><br><br><a onClick="setNoOfPlayer(3)" href="/play" class="myButton">3 players</a><br><br><a onClick="setNoOfPlayer(4)" href="/play" class="myButton">4 players</a><br><br><a onClick="chooseMapSize(2)" class="myButton">Back</a>';
	playerMenu.appendChild(ele);
}

function setDifficulty(diff){
	localStorage.setItem("difficulty", diff);
}

function setNoOfPlayer(NoOfPlayer){
	localStorage.setItem("NoOfPlayer", NoOfPlayer);
}

function setMapSize(mapSize){
	localStorage.setItem("mapSize", mapSize);
}
function restoreMenu(){		
	document.getElementById("instruction").innerHTML="Choose a mode:";
	var mapMenu = document.getElementById("mapMenu");
	mapMenu.innerHTML='';
	
	var mode = document.getElementById("mode");
	mode.innerHTML='<div id="1" onClick="chooseMapSize(id)" class="myButton">Single Player</div><br><br><div id="2" onClick="chooseMapSize(id)" class="myButton">Multiplayer</div><br><br><a href="/rank" class="myButton">Leaderboard</a><br><br><a href="/help" class="myButton">Help</a>';
	
	
}
