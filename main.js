//https://hypergamesdev.github.io
//https://api.jquery.com

//#region  Variables & Classes
//Game settings
const gameSpeed_Def=1;
const craftMult_def=1;
const dropMult_def=2;
const startItemCount_Def=3;
const cpuComplexity_Def=3;//0 to 3
const _tickrate=1000/60;

var gameSpeed=gameSpeed_Def;
var craftMult=craftMult_def;
var startItemCount=startItemCount_Def;
var cpuComplexity=cpuComplexity_Def;//0 to 3
var itemsNeededToMove=true;
var itemAlwaysUsedOnMove=false;
var dropMult=dropMult_def;
var returnItemOnWin=true;
var renewableStartItem=false;
var renewableStartItemS=1.5;
var unlockableRecipes=true;
var autoRemoveRecipesWhenItemNotExist=true;
var hideUndiscoveredItems=true;
var hideUndiscoveredStations=true;
var hideUndiscoveredRecipes=true;
var hideLockedRecipes=false;
var hideLockedRecipesIngredients=false;
var lockSelectingNotOwnedStations=true;
var displayChanceInIngredients=true;
var displayStationInIngredients=true;
var displayStationNoUseInIngredients=false;

//Basic Variables
var move=0,moveCPU=0;
var wins=0,losses=0,draws=0;
var firstMovesCPU=new Array(3);
var last3MovesPlayer=new Array(3);
var last3MovesCPU=new Array(3);
var selectedStation="";

//other
var debug=true;
var cheatAllItems=false;
var unlockAllRecipes=false;
var tooltips=true;
var itemsTableWidth=3;
/// }


//#region  Base
setTimeout(function Start(){
	if(debug)console.log("start");
	if(GetPageName()=="game.html"){SetupGame();}
	else{SetupMainMenu();}
},20);
function SetupGame(){
	if(debug)console.log("SETTING UP GAME");
	LoadMainMenuOptions();

	SetupItems();
	SetupRecipes();

	for(let i=1;i<=3;i++){
		$("#move"+i).on("click", UseMove.bind(this,i));
		$("#move"+i).html("<img src="+GetImg(TranslateMove(i))+" alt="+TranslateMove(i)+">");
	}
	$("#mVSicon").append("<img src='"+GetImg("VS")+"'/>");

	RandomizeFirstCPUMoves();
	DiscoverItem("Hand");
	GiveStartingItems();
	DisplayItems();
	SelectStation("Hand");

	UpdateFunc(Update);
}
function SetupMainMenu(){
	if(debug)console.log("SETTING UP MAIN MENU");

	//if(localStorage.getItem("gameSpeed")==null){DefaultOptions();}
	if(localStorage.getItem("craftMult")==null){DefaultOptions();}

	//$("#gameSpeed-Input").val(localStorage.getItem("gameSpeed"));	$("#gameSpeed-Input").next("output").val($("#gameSpeed-Input").val());
	$("#craftMult-Input").val(localStorage.getItem("craftMult"));	$("#craftMult-Input").next("output").val($("#craftMult-Input").val());
	$("#dropMult-Input").val(localStorage.getItem("dropMult"));	$("#dropMult-Input").next("output").val($("#dropMult-Input").val());
	$("#startItemCount-Input").val(localStorage.getItem("startItemCount"));
	$("#cpuComplexity-List").val(localStorage.getItem("cpuComplexity"));
	$("#discoverAllItems-Checkbox").prop("checked",eval(localStorage.getItem("discoverAllItems")));
	$("#unlockAllRecipes-Checkbox").prop("checked",eval(localStorage.getItem("unlockAllRecipes")));
	$("#cheatAllItems-Checkbox").prop("checked",eval(localStorage.getItem("cheatAllItems")));
}
function StartGame(){
	//localStorage.setItem("gameSpeed",$("#gameSpeed-Input").val());
	localStorage.setItem("craftMult",$("#craftMult-Input").val());
	localStorage.setItem("dropMult",$("#dropMult-Input").val());
	localStorage.setItem("startItemCount",$("#startItemCount-Input").val());
	localStorage.setItem("cpuComplexity",$("#cpuComplexity-List").val());
	localStorage.setItem("discoverAllItems",$("#discoverAllItems-Checkbox").prop("checked"));
	localStorage.setItem("unlockAllRecipes",$("#unlockAllRecipes-Checkbox").prop("checked"));
	localStorage.setItem("cheatAllItems",$("#cheatAllItems-Checkbox").prop("checked"));
	
	PageRedirect("game.html");
}
function LoadMainMenuOptions(){
	LoadOptions();
}
var _gettingRedirected=false;
$(window).bind('beforeunload',function(){
	if(_gettingRedirected){return;}
	else{DefaultOptions();}
	_gettingRedirected=false;
	
});
function DefaultOptions(){
	//localStorage.setItem("gameSpeed",gameSpeed_Def);
	localStorage.setItem("craftMult",craftMult_Def);
	localStorage.setItem("dropMult",dropMult_Def);
	localStorage.setItem("startItemCount",startItemCount_Def);
	localStorage.setItem("cpuComplexity",cpuComplexity_Def);
	localStorage.setItem("discoverAllItems",false);
	localStorage.setItem("unlockAllRecipes",false);
	localStorage.setItem("cheatAllItems",false);
}
function LoadOptions(){
	//gameSpeed=eval(localStorage.getItem("gameSpeed"));
	craftMult=eval(localStorage.getItem("craftMult"));
	dropMult=eval(localStorage.getItem("dropMult"));
	startItemCount=eval(localStorage.getItem("startItemCount"));
	cpuComplexity=eval(localStorage.getItem("cpuComplexity"));
	discoverAllItems=eval(localStorage.getItem("discoverAllItems"));
	unlockAllRecipes=eval(localStorage.getItem("unlockAllRecipes"));
	cheatAllItems=eval(localStorage.getItem("cheatAllItems"));
}

function Update(){
	if(unlockableRecipes)UnlockableRecipes();
	if(autoRemoveRecipesWhenItemNotExist)AutoRemoveRecipesWhenItemNotExist();
	if(!renewableStartItem)StopCor("RenewableItem");
}

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
	
	UpdateItems();
}
function WinConditions(){
	if(move==moveCPU||move==0||moveCPU==0){return 0;}
	if(move==1&&moveCPU==2){if(itemsNeededToMove&&!itemAlwaysUsedOnMove)UseItemsLose("Rock");return 2;}//Rock vs Paper
	if(move==1&&moveCPU==3){GiveItemsWin("Rock");return 1;}//Rock vs Scissors
	if(move==2&&moveCPU==1){GiveItemsWin("Paper");return 1;}//Paper vs Rock
	if(move==2&&moveCPU==3){if(itemsNeededToMove&&!itemAlwaysUsedOnMove)UseItemsLose("Paper");return 2;}//Paper vs Scissors
	if(move==3&&moveCPU==1){if(itemsNeededToMove&&!itemAlwaysUsedOnMove)UseItemsLose("Scissors");return 2;}//Scissors vs Rock
	if(move==3&&moveCPU==2){GiveItemsWin("Scissors");return 1;}//Scissors vs Paper
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
		
	function DebugLog(){if(debug)console.log("%cPlayer: "+last3MovesPlayer,"color: #327212");return;}
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
		
	function DebugLog(){if(debug)console.log("%cCPU: "+last3MovesCPU,"color: #810404");return;}
}
//}


//#region  Other
function Randomize(min=1,max=100){return Math.floor(Math.random()*(max-min+1))+min;}
function GetPageName(){return window.location.pathname.split("/").pop();}
function PageRedirect(path){_gettingRedirected=true;window.location.href=(path);}
const delay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
const delaywGameSpeed = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms/gameSpeed));
async function UpdateFunc(callback){await delay(_tickrate);callback();UpdateFunc(callback);}
async function RepeatDelayFunc(callback,ms){await delaywGameSpeed(ms);callback();RepeatDelayFunc(callback);}

function TranslateMove(m){	let moveName="";
	switch(m){
		case 1: moveName="Rock";break;
		case 2: moveName="Paper";break;
		case 3: moveName="Scissors";break;
		default: moveName="??";break;
	}return moveName;
}
function GetColorBasedOnChance(i){	let color="green";
	if(i<75&&i>=50)color="yellow";
	if(i<50&&i>=25)color="orange";
	if(i<25)color="red";
	return color;
}
function SpecialNumbers(n){	let sign=n;
	if(n=="-4"){sign="?";}
	if(n=="-5"){sign="∞";}
	return sign;
}
function _isSpecialNumber(n){
	return (n=="-4"||n=="-5");
}
function AddTooltip(element,text,dir=0){
	if(tooltips){
		//Setting direction doesnt even work
		let _dir="_Bot";
		switch(dir){
			case 1:_dir="_Top";break;
			case 2:_dir="_Left";break;
			case 3:_dir="_Right";break;
			default:_dir="_Bot";break;
		}
		//if(debug)console.log("Adding tooltip for: "+element+" with text: "+text)
		$(element).addClass("tooltip");
		$(element).addClass("tooltip"+_dir);
		$(element).append("<br><span class='tooltiptext'>"+text+"</span>").addClass("tooltiptext"+_dir);
	}
}
/// }