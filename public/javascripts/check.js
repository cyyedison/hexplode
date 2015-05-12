String.prototype.replaceAt=function(index, character) { //self-defined function to replace a char in a string, since string in js is immutable.
	return this.substr(0, index) + character + this.substr(index+character.length);
}
var maxPlayerNum;
var difficulty = localStorage.getItem("difficulty");
var singlePlayer = false;
var ROW = localStorage.getItem("mapSize");
var COLUMN = localStorage.getItem("mapSize");
var noOwner = "hexagon";
var ownerX = "hexagonp";
var turn; //count the no. of round played, because the game will only win after the second round!
var currPlayer;
var explodequeue;
	
function AI(){
	//disable the player's click when the CPU is "thinking" in 1 second
	for (var n=1;n< document.getElementsByTagName("div").length;n++)
		document.getElementsByTagName("div").item(n).setAttribute("onclick", "null");
			
	if (difficulty==1){//easy mode,just randomly choose place
		setTimeout(function(){		
		var randomid = Math.floor((Math.random() * ROW) + 1)+""+Math.floor((Math.random() * COLUMN) + 1);
		//add(randomid);
		var currHexOwner = document.getElementById(randomid).className;
		while ((currHexOwner != noOwner) && (currHexOwner != "hexagonp2")){
			randomid = Math.floor((Math.random() * ROW) + 1)+""+Math.floor((Math.random() * COLUMN) + 1);
			currHexOwner = document.getElementById(randomid).className;
		}
		add(randomid);
		//reactivate the player's clicking
		for (var c=1;c< document.getElementsByTagName("div").length;c++)
			document.getElementsByTagName("div").item(c).setAttribute("onclick", "add(id);");
		}, 1000);	
	}
	else if(difficulty==2){//hard mode
		setTimeout(function(){
			var NoOfNoOwner = document.querySelectorAll('.'+noOwner).length;
			var NoOfOwn = document.querySelectorAll(".hexagonp2").length;
			var randomno;
			var randomid;
			if (NoOfNoOwner != 0){//4.randomly choose place that has no owner
				randomno = Math.floor((Math.random() * NoOfNoOwner) )+"";
				randomid = document.querySelectorAll('.'+noOwner).item(randomno).id;
			}
			else{//5.if all places have owner, choose the CPU owned place which is cloest to explosion, excluding the top left and bottom right corner.
				var minExplodeNo=9;
				var minExplodePos;
				var b;
				for (b=0;b<NoOfOwn;b++){
					if ( (document.querySelectorAll(".hexagonp2").item(b).id=="11") || (document.querySelectorAll(".hexagonp2").item(b).id==(ROW+""+COLUMN)))
						continue;

					if (parseInt(document.getElementById('p'+document.querySelectorAll(".hexagonp2").item(b).id).innerHTML.charAt(2))-parseInt(document.getElementById('p'+document.querySelectorAll(".hexagonp2").item(b).id).innerHTML.charAt(0))<=minExplodeNo){
						minExplodeNo=parseInt(document.getElementById('p'+document.querySelectorAll(".hexagonp2").item(b).id).innerHTML.charAt(2))-parseInt(document.getElementById('p'+document.querySelectorAll(".hexagonp2").item(b).id).innerHTML.charAt(0));
						minExplodePos=b;
					}
				}
				randomid = document.querySelectorAll(".hexagonp2").item(minExplodePos).id;
			}
			
		//3.if the top right or bottom left corner has no owner, choose it.
		if (document.getElementById(ROW+'1').className == noOwner)
			randomid = ROW+'1';
		if (document.getElementById('1'+COLUMN).className == noOwner)
			randomid = '1'+COLUMN;		
		
		//2.if the top left or bottom right corner has no owner, choose it.	
		if (document.getElementById("11").className == noOwner)
			randomid = "11";
		else if (document.getElementById(ROW+""+COLUMN).className == noOwner)
			randomid = ROW+""+COLUMN;
			
		//1.if the CPU own the top left or bottom right corner, and its neighbour is 1 away from explosion, choose it.
		if (document.getElementById("11").className == "hexagonp2" && (parseInt(document.getElementById("p12").innerHTML.charAt(2))-parseInt(document.getElementById("p12").innerHTML.charAt(0))==1 || parseInt(document.getElementById("p21").innerHTML.charAt(2))-parseInt(document.getElementById("p21").innerHTML.charAt(0))==1))
			randomid = "11";				
		
		if (document.getElementById(ROW+""+COLUMN).className == "hexagonp2" && (parseInt(document.getElementById("p"+(ROW-1)+COLUMN).innerHTML.charAt(2))-parseInt(document.getElementById("p"+(ROW-1)+COLUMN).innerHTML.charAt(0))==1 || parseInt(document.getElementById("p"+ROW+(COLUMN-1)).innerHTML.charAt(2))-parseInt(document.getElementById("p"+ROW+(COLUMN-1)).innerHTML.charAt(0))==1))
			randomid = ROW+""+COLUMN;
			
		add(randomid);
		//reactivate the player's clicking
		for (var c=1;c< document.getElementsByTagName("div").length;c++)
			document.getElementsByTagName("div").item(c).setAttribute("onclick", "add(id);");
		}, 1000);
	}
}

function checkWin(playerClass, turn) {
	var win = true;
	
	if(turn > 1) { //should only check after the second round, otherwise the first player will immediately win after the first move, since no player2's places are there
		for (var row = 1; row <= ROW; row++){
			for (var col = 1; col <=COLUMN; col++){
				var currHexOwner = document.getElementById(row.toString()+col.toString()).className;
				if ((currHexOwner != noOwner) && (currHexOwner != playerClass)) {
					win = false;
					return win;
				}
			}
		}
		return win;
	}
	return false;
}

var eliminatedPlayer=[];
function eliminate(player){
	if (eliminatedPlayer.indexOf(player)==-1){
		eliminatedPlayer.push(player);
		if (!singlePlayer)
			alert("Player "+player+" has been eliminated!");
	}
}

function add(id){
	var player = parseInt(document.getElementById("currPlayer").textContent);
	var playerClass = ownerX + player;
	var currHexOwner = document.getElementById(id).className;
	
	//this is for disabling the current player choosing the other player's place
	if ((currHexOwner != noOwner) && (currHexOwner != playerClass)) {
		alert("You can't select other player's place!");
		return 0;
	}
	
	var number;
	number = document.getElementById('p'+id); //get the obj of the number inside the hexagon, like 0/2
	
	var nummax = number.innerHTML.charAt(2); //get the max. no. that the hexagon can hold
	
	var numstr = number.innerHTML; //get the no. of the obj number
	if (numstr.charAt(0) == "0") { //if the place have no owner, give it to him (change the color)
		document.getElementById(id).className = playerClass;
	}
	
	numstr=numstr.replaceAt(0,(parseInt(numstr.charAt(0))+1).toString()); //add 1 to the current number (e.g. 0/2 -> 1/2)
	number.innerHTML = numstr; //really update the new current number
	
	if (numstr.charAt(0) == nummax){ //if the current number = max. number, e.g. 2/2, need to explode
		numstr=numstr.replaceAt(0,"0"); //change the current no. to zero
		number.innerHTML = numstr; //really update the current number		
	    //		explode('p'+id); //here comes the recursion explosion part
        explodequeue.push('p' + id);
	}
	var won;
	var exploded = false;
	while (explodequeue.length > 0) {
		exploded=true;
	    explode(playerClass, explodequeue[0]);
	    explodequeue.shift();		
		won = checkWin(playerClass, turn);
		if (won) {
			break;
		}		
	}
		
	
	if (document.getElementById('p'+id).innerHTML.charAt(0) == "0") //if the current number is 0, it should be changed to no owner's place
		document.getElementById(id).className = noOwner;

	if (won){
		if (!singlePlayer){
			document.getElementById("win").play();
			alert('Player ' + player + ' win!'); //show which player win and refresh the page to play again.
		}
		else if(player==1){
				document.getElementById("win").play();
				alert('You win!');	
				window.location = "updaterank.php";
			}
			else{
				document.getElementById("lose").play();
				alert('You lose!');				
			}
		//window.location = "/menu";
	}
	else if(exploded)
		document.getElementById("explosion").play();
		
	if (turn>1)
		for (var z = 1;z<=maxPlayerNum;z++)
			if (document.body.querySelector(('.'+ownerX+z))==null)
				eliminate(z);
	player++;
	if (player > maxPlayerNum) {
			player = 1;
			turn++;
			document.getElementById("currTurn").textContent = turn;
	}
	while (eliminatedPlayer.indexOf(player)!=-1){
		player++;
		if (player > maxPlayerNum) {
			player = 1;
			turn++;
			document.getElementById("currTurn").textContent = turn;
		}
	}
		
	document.getElementById("currPlayer").textContent = player;
	if (player==1) 
		document.getElementById("currColor").style.backgroundColor = "#ffbb00";
	if (player==2)
		document.getElementById("currColor").style.backgroundColor = "#b02d2d";
	if (player==3)
		document.getElementById("currColor").style.backgroundColor = "#01ba01";
	if (player==4)
		document.getElementById("currColor").style.backgroundColor = "#bf00ff";
		
	if (singlePlayer && player == 2){	//the CPU turn
		AI();		
	}
}

function explode(playerClass, id){
	var neighbors = {
		'left' : id.charAt(1) + (parseInt(id.charAt(2)) - 1).toString(), 
		'right' : id.charAt(1) + (parseInt(id.charAt(2))+1).toString(), 
		'topLeft' : (parseInt(id.charAt(1)) - 1).toString() + id.charAt(2),
		'topRight' : (parseInt(id.charAt(1)) - 1).toString() + (parseInt(id.charAt(2)) + 1).toString(),
		'bottomLeft' : (parseInt(id.charAt(1)) + 1).toString() + (parseInt(id.charAt(2)) - 1).toString(),
		'bottomRight' : (parseInt(id.charAt(1)) + 1).toString() + id.charAt(2),
	};
	//this part will handle the 6 neighbouring hexagons, if they exist.
	var ele;
	for (var currPos in neighbors) {
		ele = document.getElementById('p' + neighbors[currPos]); //hexagon at current position
	
		if (ele != null){ //only do if it exists		
			document.getElementById(neighbors[currPos]).className = playerClass;
				
			var numstr = ele.innerHTML;
			numstr = numstr.replaceAt(0,(parseInt(numstr.charAt(0))+1).toString());
			ele.innerHTML = numstr; //add 1 to the current number
			
			var nummax = ele.innerHTML.charAt(2); //get the place's max number
			
			if (numstr.charAt(0) >= nummax){ //if current number = max number, need to explode again, recursion~
				document.getElementById(neighbors[currPos]).className=noOwner; //first change the place to no owner
				numstr=numstr.replaceAt(0,"0"); //then change the current number to 0
				ele.innerHTML = numstr;
				explodequeue.push(ele.id);
			}
		}
	}
}
