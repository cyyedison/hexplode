function read(){
	var fs = require("fs");
	var content = fs.readFileSync("../db/rank.txt");
	console.log("Contents: " + content);
}