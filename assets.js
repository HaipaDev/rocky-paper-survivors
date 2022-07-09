/// Files & Images
var filesPath="src/";
var imgSubPath="img/";
var itemsSubPath="items/";
var imgDef=filesPath+imgSubPath+"questionMark.png";

var files=new Array(0);

class File{
	constructor(name,fileName,subpath,extension){
		this.name=name;
		this.fileName=fileName;
		this.subpath=subpath;
		this.extension=extension;
	}
}
function NewFile(
	name="",
	fileName="",
	subpath="",
	extension=""
){files.push(new File(name,fileName,subpath,extension));}
function NewImage(
	name,
	fileName="",
	subpath="",
	extension=".png"
){NewFile(name,fileName,imgSubPath+subpath,extension);}
function NewItemImage(
	name,
	fileName="",
	extension=".png"
){NewImage(name,fileName,itemsSubPath,extension);}
function GetFile(){let f="";
	let i=files.find(x=>x.name==name);
	if(i!==undefined){
		if(i.fileName!=""){f=filesPath+i.subpath+i.fileName+i.extension;}
		else{console.warning("FILE NOT FOUND: ");f=null;}
	}else{console.warning("FILE NOT FOUND: "+filesPath+i.subpath+i.fileName+i.extension);f=null;}
	return f;
}
function GetImg(name){
	let img="";
	let i=files.find(x=>x.name==name);
	if(i!==undefined){
		if(i.fileName!=""){img=filesPath+i.subpath+i.fileName+i.extension;}
		else{img=imgDef;}
	}else{img=imgDef;}
	return img;
}

SetupFiles();
function SetupFiles(){		files=new Array(0);
	//Images
	NewImage("icon","icon");
	NewImage("equals","equals");
	NewImage("plus","plus");
	NewImage("VS","VS");
	
	NewItemImage("Rock","Rock");
	NewItemImage("Paper","Paper");
	NewItemImage("Scissors","Scissors");
	NewItemImage("Wood","Wood");
	NewItemImage("Metal Scrap","MetalScrap");
	NewItemImage("Campfire","Campfire");
	NewItemImage("Compressor","Compressor");
	NewItemImage("Hand","Hand");
	NewItemImage("Axe","Axe");
	NewItemImage("Pickaxe","Pickaxe");
	NewItemImage("Metal Axe","MetalAxe");
	NewItemImage("Metal Pickaxe","MetalPickaxe");
	NewItemImage("Charcoal","Charcoal");
}

/// IEnumerators
var coroutines=new Array(0);

class Coroutine{
	constructor(name,callback,time,realtime){
		this.name=name;
		this.callback=callback;
		this.time=time;
		this.realtime=realtime;
		this.on=true;
	}
	async Call(loop=false){
		if(!this.realtime){await delaywGameSpeed(1000*this.time);}
		else{await delay(1000*this.time);}
		if(this.on){
			console.log("CALLED "+this.name);
			this.callback();
			if(loop)this.Call(loop);
		}
	}
	Stop(){if(this.on)this.on=false;}
}
function NewCor(name,callback,time,realtime=false,call=true,loop=false){
	coroutines.push(new Coroutine(name,callback,time,realtime));
	if(call)GetCor(name).Call(loop);
	return GetCor(name);
}
function GetCor(name){return coroutines.find(x=>x.name==name);}
function StopCor(name){let cor=coroutines.find(x=>x.name==name);if(cor!=null)cor.Stop();}
//if cor does not exist autocreate one into the array of them, if off remove?

Array.prototype.any = function(func) {
	return this.some(func || function(x) { return x });
}