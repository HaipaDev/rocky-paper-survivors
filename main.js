//https://api.jquery.com

//#region  Variables & Classes
//Game settings
var gameSpeed_Def=1;
var reverseGameTest_Def=true;
var cpuComplexity_Def=3;//0 to 3

var gameSpeed=gameSpeed_Def;
var updateSpeedMs=1000/60;
var reverseGameTest=reverseGameTest_Def;
var cpuComplexity=cpuComplexity_Def;//0 to 3
var itemsNeededToMove=true;
var itemAlwaysUsedOnMove=false;
var renewableStartItem=true;
var renewableStartItemMs=1500;
var unlockableRecipes=true;

//Basic Variables
var move=0,moveCPU=0;
var wins=0,losses=0,draws=0;
var firstMovesCPU=new Array(3);
var last3MovesPlayer=new Array(3);
var last3MovesCPU=new Array(3);

//other
var debug=true;
var cheatAllItems=false;
var tooltips=true;
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
	GiveStartingItems();
	DisplayItems();

	UpdateFunc(Update);
}
function SetupMainMenu(){
	if(debug)console.log("SETTING UP MAIN MENU");

	$("#gameSpeed-Input").val(localStorage.getItem("gameSpeed"));	$("#gameSpeed-Input").next("output").val($("#gameSpeed-Input").val());
	//$("#reverseGametest-Checkbox").prop("checked",eval(localStorage.getItem("reverseGametest")));
	$("#cpuComplexity-List").val(localStorage.getItem("cpuComplexity"));
}
function StartGame(){
	localStorage.setItem("gameSpeed",$("#gameSpeed-Input").val());
	localStorage.setItem("reverseGameTest",$("#reverseGametest-Checkbox").prop("checked"));
	localStorage.setItem("cpuComplexity",$("#cpuComplexity-List").val());
	
	PageRedirect("game.html");
}
function LoadMainMenuOptions(){
	if(debug){console.log("--- PRE:");
	console.log(gameSpeed);
	console.log(reverseGameTest);
	console.log(cpuComplexity);}

	gameSpeed=eval(localStorage.getItem("gameSpeed"));
	reverseGameTest=eval(localStorage.getItem("reverseGameTest"));
	cpuComplexity=eval(localStorage.getItem("cpuComplexity"));
	
	if(debug){console.log("--- POST:");
	console.log(gameSpeed);
	console.log(reverseGameTest);
	console.log(cpuComplexity);
	console.log("---");}
}
var _gettingRedirected=false;
$(window).bind('beforeunload',function(){
	if(_gettingRedirected){return;}
	else{
		localStorage.setItem("gameSpeed",gameSpeed_Def);
		localStorage.setItem("reverseGameTest",reverseGameTest_Def);
		localStorage.setItem("cpuComplexity",cpuComplexity_Def);
	}
	_gettingRedirected=false;
	
});

function Update(){
	if(unlockableRecipes)UnlockableRecipes();
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
function Randomize(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function GetPageName(){return window.location.pathname.split("/").pop();}
function PageRedirect(path){_gettingRedirected=true;window.location.href=(path);}
const delay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
const delaywGameSpeed = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms/gameSpeed));
async function UpdateFunc(callback){await delay(updateSpeedMs);callback();UpdateFunc(callback);}
async function RepeatDelayFunc(callback,ms){await delaywGameSpeed(ms);callback();RepeatDelayFunc(callback);}

function TranslateMove(m){	let moveName="";
	switch(m){
		case 1: moveName="Rock";break;
		case 2: moveName="Paper";break;
		case 3: moveName="Scissors";break;
		default: moveName="??";break;
	}return moveName;
}
function AddTooltip(element,text,dir=1){
	if(tooltips){
		//Setting direction doesnt even work
		let _dir="";
		switch(dir){
			case 1:_dir="_bot";break;
			case 2:_dir="_left";break;
			case 3:_dir="_right";break;
			default:_dir="";break;
		}
		//if(debug)console.log("Adding tooltip for: "+element+" with text: "+text)
		$(element).addClass("tooltip");
		if(_dir!="")$(element).addClass("tooltip"+_dir);
		$(element).append("<span class='tooltiptext'>"+text+"</span>").addClass("tooltiptext"+_dir);
	}
}
/// }