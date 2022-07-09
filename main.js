//https://api.jquery.com

//#region  Variables & Classes
//Game settings
var trueRandomCPU=false;
var renewablePaper=true;
var renewablePaperMs=3000;
var itemsNeededToMove=true;
var itemAlwaysUsedOnMove=false;

//Basic Variables
var move=0,moveCPU=0;
var wins=0,losses=0,draws=0;
var firstMovesCPU=new Array(3);
var last3MovesPlayer=new Array(3);
var last3MovesCPU=new Array(3);

//Items,Recipes etc
class Item{
	constructor(name="",count=0,craftable=false,station=false){
		this.name=name;
		this.count=count;
		this.craftable=craftable;
		this.station=station;
	}
}
var items=new Array(0);
var regularItems=["Rock","Paper","Scissors"];
var craftableItems=["Wood","MetalFrags"];
var stationsItems=["Compressor","Campfire"];
var craftableStationsItems=["Compressor","Campfire"];

class Recipe{
	constructor(name="",count=1,
	station="",stUses=1,
	item1="",item1Cost=1,
	item2="",item2Cost=0,
	item3="",item3Cost=0){
		this.name=name;
		this.count=count;
		this.station=station;
		this.stUses=stUses;
		this.item1=item1;
		this.item1Cost=item1Cost;
		this.item2=item2;
		this.item2Cost=item2Cost;
		this.item3=item3;
		this.item3Cost=item3Cost;
	}
}
var recipes=new Array(0);

//other
var imgPath="src/img/";
/// }


//#region  Base
setTimeout(function Setup(){
	for(let i=1;i<=3;i++){
		$("#move"+i).on("click", UseMove.bind(this,i));
		$("#move"+i).html("<img src="+GetImg(TranslateMove(i))+" alt="+TranslateMove(i)+">");
	}
	SetupItems();
	var itemTable="<table>";
	for(let i=0;i<items.length/3;i++){
		itemTable+='<tr id="itemsRow'+i+'">';
		for(let j=0;j<3;j++){
			let id=(j+(3*i));
			itemTable+='<td class="tdItem" id="item'+id+'"></td>';
		}
		itemTable+='</tr>';
	}
	itemTable+="</table>";
	$('#itemsTable').append(itemTable);
	
	SetupRecipes();
	
	$("#outcomeData").html("\
		<table id='movesTable'><tr>\
			<td id='mMovePlayer'></td>\
			<td id='mVSicon'><img src="+GetImg("VS")+"></td>\
			<td id='mMoveCPU'></td>\
		</tr></table>\
		<table id='mWinsLosses'><tr>\
			<td id='mPlayer'><div id='mWinPlayer_IMG'></div><span id='mWinsPlayer'></span></td>\
			<td id='mDraw'><span id='mDraws'></span><div id='mDraws_IMG'></div></td>\
			<td id='mCPU'><div id='mWinCPU_IMG'></div><span id='mWinsCPU'></span></td>\
		</tr></table>\
	");
	
	RandomizeFirstCPUMoves();
	GiveStartingItems();
	DisplayItems();
},100);

function UseMove(m){
	if(itemsNeededToMove){
		if(items.find(x=>x.name==TranslateMove(m))!=null){
			let item=items.find(x=>x.name==TranslateMove(m));
			if(item.count>=1){if(itemAlwaysUsedOnMove){item.count-=1;}}
			else{return;}
		}
	}else{}
	move=m;
	$("#mMovePlayer").html("<img src="+GetImg(TranslateMove(move))+">")
	
	CPUMove();
}
function CPUMove(){
	moveCPU=GetCPUMove();
	$("#mMoveCPU").html("<img src="+GetImg(TranslateMove(moveCPU))+">")
	
	SumupRound();
}
function SumupRound(){
	SetLastMovesPlayer();
	SetLastCPUMoves();
	
	let winCond=WinConditions();
	if(winCond==1){wins++;
		$("#mWinPlayer_IMG").html("<img src="+GetImg("plus")+">");
		$("#mWinCPU_IMG").html("");
		$("#mDraws_IMG").html("");
	}
	else if(winCond==2){losses++;
		$("#mWinPlayer_IMG").html("");
		$("#mWinCPU_IMG").html("<img src="+GetImg("plus")+">");
		$("#mDraws_IMG").html("");
	}
	else{draws++;
		$("#mWinPlayer_IMG").html("");
		$("#mWinCPU_IMG").html("");
		$("#mDraws_IMG").html("<img src="+GetImg("equals")+">");
	}
	$("#mWinsPlayer").html(wins);
	$("#mWinsCPU").html(losses);
	$("#mDraws").html(draws);
	
	DisplayItems();
}
function WinConditions(){
	if(move==moveCPU||move==0||moveCPU==0){return 0;}
	if(move==1&&moveCPU==2){if(itemsNeededToMove&&!itemAlwaysUsedOnMove)UseItem("Rock");return 2;}//Rock vs Paper
	if(move==1&&moveCPU==3){GiveItem("Scissors");return 1;}//Rock vs Scissors
	if(move==2&&moveCPU==1){GiveItem("Rock");return 1;}//Paper vs Rock
	if(move==2&&moveCPU==3){if(itemsNeededToMove&&!itemAlwaysUsedOnMove)UseItem("Paper");return 2;}//Paper vs Scissors
	if(move==3&&moveCPU==1){if(itemsNeededToMove&&!itemAlwaysUsedOnMove)UseItem("Scissors");return 2;}//Scissors vs Rock
	if(move==3&&moveCPU==2){GiveItem("Paper");return 1;}//Scissors vs Paper
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


//#region  Other
function Randomize(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
/*function checkIfFileExist(urlToFile) {
    /*var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
	$.ajax({
		url:urlToFile,
		type:'HEAD',
		error: function(){
			return false;
		},
		success: function(){
			return true
		}
	});
}*/
function _ifFileExist(src) {let b=false;
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
            b=true;
        }
    }
    xhr.open('HEAD', src);
	return b;
}
function executeIfFileExist(src, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
            callback()
        }
    }
    xhr.open('HEAD', src)
}

/*function onInitFs(fs) {
	console.log('Opened file system: ' + fs.name);
}
window.requestFileSystem(window.TEMPORARY, 1*1024*1024, onInitFs, errorHandler);
function errorHandler(e) {
	var msg = '';
  
	switch (e.code) {
	  case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
	  case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
	  case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
	  case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
	  case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
	  default:
		msg = 'Unknown Error';
		break;
	};
	console.log('Error: ' + msg);
}
//var directoryReader=FileSystemDirectoryEntry.createReader();
function readDirectory(directory) {
	let dirReader = directory.createReader();
	let entries = [];
  
	let getEntries = function() {
	  dirReader.readEntries(function(results) {
		if (results.length) {
		  entries = entries.concat(toArray(results));
		  getEntries();
		}
	  }, function(error) {
		// handle error -- error is a FileError object
	  });
	};
  
	getEntries();
	return entries;
}
function loadImg(appDataDirEntry, name) {
	appDataDirEntry.getDirectory(imgPath, {}, function(dirEntry) {
	  dirEntry.getFile(name+".png", {}, function(fileEntry) {
		fileEntry.file(function(dictFile) {
		  let reader = new FileReader();
  
		  reader.addEventListener("loadend", function() {
			return 1;
		  });
  
		  reader.readAsText(dictFile);
		});
	  });
	});
}*/
function GetImg(name){
	let pathDef="";let pathImg=(imgPath+name+".png");let path=pathDef;
	path=pathImg;
	//if(loadImg(name)!=null){path=pathImg;}
	//getFile(path?: string | null, options?: FileSystemFlags, successCallback?: FileSystemEntryCallback, errorCallback?: ErrorCallback): void;
	/*if(pathImg===pathDef)*///path=pathImg;
	/*try{
		if(_ifFileExist(pathImg)){path=pathImg;}
		//executeIfFileExist(pathImg,path=pathImg);
		//if((imgPath+name+".png")!=null)path=pathImg;
	}catch(err){
		console.error(err);
	}*/
	return path;
}
function TranslateMove(m){	let moveName="";
	switch(m){
		case 1: moveName="Rock";break;
		case 2: moveName="Paper";break;
		case 3: moveName="Scissors";break;
		default: moveName="??";break;
	}return moveName;
}
const delay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
//async function RepeatDelayFunc(callback,ms){async delay ms;callback();}
/// }