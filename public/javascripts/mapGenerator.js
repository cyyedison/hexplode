var mapSize;
var maxPlayerNum = localStorage.getItem('NoOfPlayer');
if (maxPlayerNum>=2)
	document.getElementById("multiInstruction").innerHTML='Share the URL to other players to join room!';

function hexDivCreate(map, row, col, rowSize, colSize) {
	var limit = 6;
	var hexId = row.toString() + col.toString();
	var contentId = "p" + hexId;
	var top = 8 + 92 * row;
	var left = 60 + 55 * ((row - 1) + 2 * (col - 1));
	
	if ((row == 1) || (row == rowSize) || (col == 1) || (col == colSize)) {
		limit = 4;
	}
	if (((row == 1) && (col == colSize)) || ((row == rowSize) && (col == 1))) {
		limit = 3;
	}
	if (((row == 1) && (col == 1)) || ((row == rowSize) && (col == colSize))) {
		limit = 2;
	}
	
	var limitContent = '0/' + limit;

	var textnode = document.createTextNode(limitContent);

	var content = document.createElement("p");
	content.setAttribute("id", contentId);
	content.setAttribute("align", "center");
	content.appendChild(textnode);

	var contentHolder = document.createElement("span");
	contentHolder.appendChild(content);

	var hexagonDiv = document.createElement("div");
	hexagonDiv.setAttribute("id", hexId);
	hexagonDiv.setAttribute("class", "hexagon");
	hexagonDiv.setAttribute("onclick", "hexClick(id);");
	hexagonDiv.style.position = "absolute"; 
	hexagonDiv.style.top = top + "px"; 
	hexagonDiv.style.left = left + "px";
	hexagonDiv.appendChild(contentHolder);
	
	map.appendChild(hexagonDiv);
}

function mapGenerate() {

	var map = document.getElementById("map");

	var rowSize = mapSize;
	var colSize = mapSize;
	for (var row = 1; row <= rowSize; row++) {
		for (var col = 1; col <= colSize; col++) {
			hexDivCreate(map, row, col, rowSize, colSize);
		}
	}

}
