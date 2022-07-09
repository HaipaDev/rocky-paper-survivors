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
	NewItemImage("MetalFrags","MetalFrags");
	NewItemImage("Campfire","Campfire");
	NewItemImage("Compressor","Compressor");
}