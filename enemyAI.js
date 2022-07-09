function RandomizeFirstCPUMoves(){	let mv=0;
	//First move
	let rnd=Randomize(1,100);
	let chanceRock=50;let chancePaper=25;//Scissors is the rest from these to a 100
	
	if(rnd<chanceRock&&chanceRock!=0){mv=1;}
	else if(rnd<=(chanceRock+chancePaper)&&rnd>=chanceRock&&(chanceRock!=0&&chancePaper!=0)){mv=2;}
	else{mv=3;}
	firstMovesCPU[0]=mv;
	let chanceScissors=100-(chanceRock+chancePaper);
	DebugLog();
	console.log("First: "+TranslateMove(mv)+" ("+mv+")");
	
	//Second move
	rnd=Randomize(1,100);
	chanceRock=40;chancePaper=45;
	if(rnd<chanceRock&&chanceRock!=0){mv=1;}
	else if(rnd<=(chanceRock+chancePaper)&&rnd>=chanceRock&&(chanceRock!=0&&chancePaper!=0)){mv=2;}
	else{mv=3;}
	firstMovesCPU[1]=mv;
	chanceScissors=100-(chanceRock+chancePaper);
	DebugLog();
	console.log("Second: "+TranslateMove(mv)+" ("+mv+")");
	
	//Third move
	rnd=Randomize(1,100);
	chanceRock=5;chancePaper=45;
	if(rnd<chanceRock&&chanceRock!=0){mv=1;}
	else if(rnd<=(chanceRock+chancePaper)&&rnd>=chanceRock&&(chanceRock!=0&&chancePaper!=0)){mv=2;}
	else{mv=3;}
	firstMovesCPU[2]=mv;
	chanceScissors=100-(chanceRock+chancePaper);
	DebugLog();
	console.log("Third: "+TranslateMove(mv)+" ("+mv+")");

	function DebugLog(){
		console.log("%cRandomized: "+rnd+" | chanceRock: "+chanceRock+" | chancePaper: "+chancePaper+"("+(chanceRock+chancePaper)+") | chanceScissors: "+chanceScissors+"(100)","color: #969696");
	}
}
function GetCPUMove(){
	let mv=0;
	if(cpuComplexity==0){mv=Randomize(1,3);}
	else{
		//First moves
		if(isNaN(last3MovesCPU[0])){mv=firstMovesCPU[0];}
		else if(isNaN(last3MovesCPU[1])){mv=firstMovesCPU[1];}
		else if(isNaN(last3MovesCPU[2])){mv=firstMovesCPU[2];}
		
		if(!isNaN(last3MovesCPU[0])
		&&!isNaN(last3MovesCPU[1])
		&&!isNaN(last3MovesCPU[2])){
			mv=GetCPUMoveBasedOnLast();}
	}
	return mv;
}
function GetCPUMoveBasedOnLast(){	let mv=0;
	let chanceRock=33;let chancePaper=33;//Scissors is the rest from these to a 100
	let rnd=Randomize(1,100);
	
	////Set the chances
	if(cpuComplexity>=1){
		//Try to draw on the 1st move
		if(last3MovesPlayer[0]==1){chanceRock=50;chancePaper=25;}
		if(last3MovesPlayer[0]==2){chanceRock=25;chancePaper=50;}
		if(last3MovesPlayer[0]==3){chanceRock=25;chancePaper=25;}
		
		//Dont keep doing the same after 2 in a row
		if(last3MovesPlayer[0]==1&&last3MovesPlayer[1]==1){chanceRock=20;chancePaper=40;}
		if(last3MovesPlayer[0]==2&&last3MovesPlayer[1]==2){chanceRock=40;chancePaper=40;}
		if(last3MovesPlayer[0]==3&&last3MovesPlayer[1]==3){chanceRock=40;chancePaper=20;}
	}
	
	if(cpuComplexity>=2){
		//After 3 in a row counter even more often
		if(last3MovesPlayer[0]==1&&last3MovesPlayer[1]==1&&last3MovesPlayer[2]==1){chanceRock=20;chancePaper=60;}
		if(last3MovesPlayer[0]==2&&last3MovesPlayer[1]==2&&last3MovesPlayer[2]==2){chanceRock=20;chancePaper=20;}
		if(last3MovesPlayer[0]==3&&last3MovesPlayer[1]==3&&last3MovesPlayer[2]==3){chanceRock=60;chancePaper=20;}
		
		//After 1 draw
		if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[0]==1){chanceRock=30;chancePaper=30;}
		if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[0]==2){chanceRock=60;chancePaper=30;}
		if(last3MovesPlayer[0]==last3MovesCPU[0]&&last3MovesPlayer[0]==3){chanceRock=30;chancePaper=60;}
	}
	
	if(cpuComplexity>=3){
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
	}
	
	
	let chanceScissors=100-(chanceRock+chancePaper);
	console.log("%cRandomized: "+rnd+" | chanceRock: "+chanceRock+" | chancePaper: "+chancePaper+"("+(chanceRock+chancePaper)+") | chanceScissors: "+chanceScissors+"(100)","color: #969696");
	
	//Select the move
	if(rnd<chanceRock&&chanceRock!=0){mv=1;}
	else if(rnd<=(chanceRock+chancePaper)&&rnd>=chanceRock&&(chanceRock!=0&&chancePaper!=0)){mv=2;}
	else{mv=3;}
	return mv;
}