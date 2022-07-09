//https://api.jquery.com
var move=0,moveCPU=0;
var wins=0,losses=0,draws=0;
var firstMovesCPU=new Array(3);
var last3MovesPlayer=new Array(3);
var last3MovesCPU=new Array(3);

var itemsIDs=["??","Rock","Paper","Scissors"];
var itemsCount=new Array(itemsIDs.length);

var trueRandomCPU=false;
var imgPath="src/img/";

//{ //Base
setTimeout(function Setup(){
	itemsCount=Array(itemsIDs.length).fill(0);
	for(let i=1;i<=3;i++){
		$("#move"+i).on("click", UseMove.bind(this,i));
		$("#move"+i).html("<img src="+imgPath+TranslateMove(i)+".png alt="+TranslateMove(i)+">");
	}
	let itemTable=$("#itemsTable");
	for(let i=1;i<itemsCount.length/3;i++){
		let itemRow=$(itemTable).append('<tr id="itemsRow'+i);
		for(let j=1;j<itemsCount.length;j++){
			$(itemRow).append('<td class="tdItem" id="item'+j+'">');
		}
	}
	DisplayItems();
	
	$("#outcomeData").html("\
		<table id='movesTable'><tr>\
			<td id='mMovePlayer'></td>\
			<td id='mVSicon'><img src="+imgPath+"VS.png></td>\
			<td id='mMoveCPU'></td>\
		</tr></table>\
		<table id='mWinsLosses'><tr>\
			<td id='mPlayer'><div id='mWinPlayer_IMG'></div><span id='mWinsPlayer'></span></td>\
			<td id='mDraw'><span id='mDraws'></span><div id='mDraws_IMG'></div></td>\
			<td id='mCPU'><div id='mWinCPU_IMG'></div><span id='mWinsCPU'></span></td>\
		</tr></table>\
	");
	
	RandomizeFirstCPUMoves();
},100);

function UseMove(m){
	move=m;
	$("#mMovePlayer").html("<img src="+imgPath+TranslateMove(move)+".png>")
	
	CPUMove();
}
function CPUMove(){
	moveCPU=GetCPUMove();
	$("#mMoveCPU").html("<img src="+imgPath+TranslateMove(moveCPU)+".png>")
	
	SumupRound();
}
function SumupRound(){
	SetLastMovesPlayer();
	SetLastCPUMoves();
	
	if(WinConditions()==1){wins++;
		$("#mWinPlayer_IMG").html("<img src="+imgPath+"plus.png>");
		$("#mWinCPU_IMG").html("");
		$("#mDraws_IMG").html("");
	}
	else if(WinConditions()==2){losses++;
		$("#mWinPlayer_IMG").html("");
		$("#mWinCPU_IMG").html("<img src="+imgPath+"plus.png>");
		$("#mDraws_IMG").html("");
	}
	else{draws++;
		$("#mWinPlayer_IMG").html("");
		$("#mWinCPU_IMG").html("");
		$("#mDraws_IMG").html("<img src="+imgPath+"equals.png>");
	}
	$("#mWinsPlayer").html(wins);
	$("#mWinsCPU").html(losses);
	$("#mDraws").html(draws);
	
	
	DisplayItems();
}
//}

//{ //CPU AI
function RandomizeFirstCPUMoves(){	let mv=0;
	//First move
	let rnd=Randomize(1,100);
	let chanceRock=50;let chancePaper=25;//Scissors is the rest from these to a 100
	
	if(rnd<chanceRock&&chanceRock!=0){mv=1;}
	else if(rnd<=(chanceRock+chancePaper)&&rnd>=chanceRock&&(chanceRock!=0&&chancePaper!=0)){mv=2;}
	else{mv=3;}
	firstMovesCPU[0]=mv;
	let chanceScissors=100-(chanceRock+chancePaper);
	console.log("Randomized: "+rnd+" | chanceRock: "+chanceRock+" | chancePaper: "+chancePaper+"("+(chanceRock+chancePaper)+") | chanceScissors: "+chanceScissors+"(100)");
	console.log("First: "+TranslateMove(mv)+" ("+mv+")");
	
	//Second move
	rnd=Randomize(1,100);
	chanceRock=40;chancePaper=45;
	if(rnd<chanceRock&&chanceRock!=0){mv=1;}
	else if(rnd<=(chanceRock+chancePaper)&&rnd>=chanceRock&&(chanceRock!=0&&chancePaper!=0)){mv=2;}
	else{mv=3;}
	firstMovesCPU[1]=mv;
	chanceScissors=100-(chanceRock+chancePaper);
	console.log("Randomized: "+rnd+" | chanceRock: "+chanceRock+" | chancePaper: "+chancePaper+"("+(chanceRock+chancePaper)+") | chanceScissors: "+chanceScissors+"(100)");
	console.log("Second: "+TranslateMove(mv)+" ("+mv+")");
	
	//Third move
	rnd=Randomize(1,100);
	chanceRock=5;chancePaper=45;
	if(rnd<chanceRock&&chanceRock!=0){mv=1;}
	else if(rnd<=(chanceRock+chancePaper)&&rnd>=chanceRock&&(chanceRock!=0&&chancePaper!=0)){mv=2;}
	else{mv=3;}
	firstMovesCPU[2]=mv;
	chanceScissors=100-(chanceRock+chancePaper);
	console.log("Randomized: "+rnd+" | chanceRock: "+chanceRock+" | chancePaper: "+chancePaper+"("+(chanceRock+chancePaper)+") | chanceScissors: "+chanceScissors+"(100)");
	console.log("Third: "+TranslateMove(mv)+" ("+mv+")");
}
function GetCPUMove(){
	let mv=0;
	if(!trueRandomCPU){
		//First moves
		if(isNaN(last3MovesCPU[0])){mv=firstMovesCPU[0];}
		else if(isNaN(last3MovesCPU[1])){mv=firstMovesCPU[1];}
		else if(isNaN(last3MovesCPU[2])){mv=firstMovesCPU[2];}
		
		if(!isNaN(last3MovesCPU[0])
		&&!isNaN(last3MovesCPU[1])
		&&!isNaN(last3MovesCPU[2])){
			mv=GetCPUMoveBasedOnLast();}
	}else{
		mv=Randomize(1,3);
	}
	return mv;
}
function GetCPUMoveBasedOnLast(){	let mv=0;
	let chanceRock=33;let chancePaper=33;//Scissors is the rest from these to a 100
	let rnd=Randomize(1,100);
	
	////Set the chances
	//Try to draw on the 1st move
	if(last3MovesPlayer[0]==1){chanceRock=50;chancePaper=25;}
	if(last3MovesPlayer[0]==2){chanceRock=25;chancePaper=50;}
	if(last3MovesPlayer[0]==3){chanceRock=25;chancePaper=25;}
	
	//Dont keep doing the same after 2 in a row
	if(last3MovesPlayer[0]==1&&last3MovesPlayer[1]==1){chanceRock=20;chancePaper=40;}
	if(last3MovesPlayer[0]==2&&last3MovesPlayer[1]==2){chanceRock=40;chancePaper=40;}
	if(last3MovesPlayer[0]==3&&last3MovesPlayer[1]==3){chanceRock=40;chancePaper=20;}
	
	//After 3 in a row counter even more often
	if(last3MovesPlayer[0]==1&&last3MovesPlayer[1]==1&&last3MovesPlayer[2]==1){chanceRock=20;chancePaper=60;}
	if(last3MovesPlayer[0]==2&&last3MovesPlayer[1]==2&&last3MovesPlayer[2]==2){chanceRock=20;chancePaper=20;}
	if(last3MovesPlayer[0]==3&&last3MovesPlayer[1]==3&&last3MovesPlayer[2]==3){chanceRock=60;chancePaper=20;}
	
	//After 1 draw
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[0]==1){chanceRock=30;chancePaper=30;}
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[0]==2){chanceRock=60;chancePaper=30;}
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[0]==3){chanceRock=30;chancePaper=60;}
	
	//After 2 draws in a row
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[1]==last3MovesCPU[1]){chanceRock=33;chancePaper=33;}
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[1]==last3MovesCPU[1]
		&&last3MovesPlayer[0]==1){
			chanceRock=3;chancePaper=87;}
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[1]==last3MovesCPU[1]
		&&last3MovesPlayer[0]==2){
			chanceRock=7;chancePaper=3;}
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[1]==last3MovesCPU[1]
		&&last3MovesPlayer[0]==3){
			chanceRock=87;chancePaper=10;}
			
	//After 3 draws in a row
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[1]==last3MovesCPU[1]&&last3MovesPlayer[2]==last3MovesCPU[2]){chanceRock=33;chancePaper=33;}
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[1]==last3MovesCPU[1]&&last3MovesPlayer[2]==last3MovesCPU[2]
		&&last3MovesPlayer[0]==1){
			chanceRock=3;chancePaper=7;}
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[1]==last3MovesCPU[1]&&last3MovesPlayer[2]==last3MovesCPU[2]
		&&last3MovesPlayer[0]==2){
			chanceRock=87;chancePaper=3;}
	if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[1]==last3MovesCPU[1]&&last3MovesPlayer[2]==last3MovesCPU[2]
		&&last3MovesPlayer[0]==3){
			chanceRock=10;chancePaper=87;}
	
	
	let chanceScissors=100-(chanceRock+chancePaper);
	console.log("Randomized: "+rnd+" | chanceRock: "+chanceRock+" | chancePaper: "+chancePaper+"("+(chanceRock+chancePaper)+") | chanceScissors: "+chanceScissors+"(100)");
	
	//Select the move
	if(rnd<chanceRock&&chanceRock!=0){mv=1;}
	else if(rnd<=(chanceRock+chancePaper)&&rnd>=chanceRock&&(chanceRock!=0&&chancePaper!=0)){mv=2;}
	else{mv=3;}
	return mv;
}
//}

//{ //Items etc
function GetItem(i,c=1){
	itemsCount[i]+=c;
}
function DisplayItems(){
	console.log(itemsIDs);
	console.log(itemsCount);
	/*$("#items").html(
	"Rock: "+itemsCount[_itemID("Rock")]
	+" | "+"Paper: "+itemsCount[_itemID("Paper")]
	+" | "+"Scissors: "+itemsCount[_itemID("Scissors")]
	);*/
	for(let i=1;i<itemsCount.length;i++){
		//$("#item"+i).html("<p class='tdText'>"+_itemName(i)+": "+itemsCount[i]+"</p>");
		$("#item"+i).html("<img src='"+imgPath+_itemName(i)+".png' class='tdImg'>"+"<br><span class='tdText'>"+itemsCount[i]+"</span>");
	}
}
//}

//{ //Other
function Randomize(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function TranslateMove(m){	let moveName="";
	switch(m){
		case 1: moveName="Rock";break;
		case 2: moveName="Paper";break;
		case 3: moveName="Scissors";break;
		default: moveName="???";break;
	}return moveName;
}
function _itemID(str){	let ID=0;
	for(var key in itemsIDs){var val=itemsIDs[key];if(val==str){ID=key;}}
	/*switch(str){
		case "Rock": ID=1;break;
		case "Paper": ID=2;break;
		case "Scissors": ID=3;break;
		default: ID=0;break;
	}*/
	return ID;
}function _itemName(ID){	let name="";
	for(var key in itemsIDs){var val=itemsIDs[key];if(key==ID){name=val;}}
	return name;
}
function WinConditions(){
	if(move==moveCPU||move==0||moveCPU==0){return 0;}
	if(move==1&&moveCPU==2){return 2;}//Rock vs Paper
	if(move==1&&moveCPU==3){GetItem(_itemID("Scissors"));return 1;}//Rock vs Scissors
	if(move==2&&moveCPU==1){GetItem(_itemID("Rock"));return 1;}//Paper vs Rock
	if(move==2&&moveCPU==3){return 2;}//Paper vs Scissors
	if(move==3&&moveCPU==1){return 2;}//Scissors vs Rock
	if(move==3&&moveCPU==2){GetItem(_itemID("Paper"));return 1;}//Scissors vs Paper
}

function SetLastMovesPlayer(){
	if(isNaN(last3MovesPlayer[0])){
		last3MovesPlayer[0]=move;
	DebugLog();return;}
	if(isNaN(last3MovesPlayer[1])){
		last3MovesPlayer[1]=last3MovesPlayer[0];
		last3MovesPlayer[0]=move;
		DebugLog();return;}
	
	if(isNaN(last3MovesPlayer[2])||
	(!isNaN(last3MovesPlayer[2])
	&&!isNaN(last3MovesPlayer[1])
	&&!isNaN(last3MovesPlayer[0]))){
		last3MovesPlayer[2]=last3MovesPlayer[1];
		last3MovesPlayer[1]=last3MovesPlayer[0];
		last3MovesPlayer[0]=move;
		DebugLog();return;}
		
	function DebugLog(){console.log("Player: "+last3MovesPlayer);return;}
}
function SetLastCPUMoves(){
	if(isNaN(last3MovesCPU[0])){
		last3MovesCPU[0]=moveCPU;
		DebugLog();return;}
	if(isNaN(last3MovesCPU[1])){
		last3MovesCPU[1]=last3MovesCPU[0];
		last3MovesCPU[0]=moveCPU;
		DebugLog();return;}
	
	if(isNaN(last3MovesCPU[2])||
	(!isNaN(last3MovesCPU[2])
	&&!isNaN(last3MovesCPU[1])
	&&!isNaN(last3MovesCPU[0]))){
		last3MovesCPU[2]=last3MovesCPU[1];
		last3MovesCPU[1]=last3MovesCPU[0];
		last3MovesCPU[0]=moveCPU;
		DebugLog();return;}
		
	function DebugLog(){console.log("CPU: "+last3MovesCPU);return;}
}
//}