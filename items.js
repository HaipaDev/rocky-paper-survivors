class Item{
	constructor(name="",count=0,station=false){
		this.name=name;
		this.count=count;
		this.station=station;
	}
}
var items=new Array(0);

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

var regularItems=["Rock","Paper","Scissors","Wood","MetalFrags"];
var stationsItems=["Compressor","Campfire"];

function GetItem(str){return items.find(x=>x.name==str);}
function GiveItem(str,c=1){let it=GetItem(str);if(it!=null){it.count+=c;console.log("%cGiving item: "+str+" x"+c,"color: #327212");UpdateItems();}else{console.error("CANT GIVE, NO ITEM BY NAME: "+str);}}
function GiveItemID(id,c=1){let it=items[id];if(it!=null){it.count+=c;console.log("%cGiving item(ID: "+id+"): "+items[id].name+" x"+c,"color: #327212");UpdateItems();}else{console.error("CANT GIVE, NO ITEM BY NAME: "+str);}}
function UseItem(str,c=1){let it=GetItem(str);
	if(it!=null){
	if(it.count>=c){it.count-=c;console.log("%cUsing item: "+str+" x"+c+" time","color: #810404");UpdateItems();}
	else{console.error("TRYING TO USE MORE("+c+") ITEMS THAN THERE ARE("+it.count+") FOR: "+str);}
	}else{console.error("CANT USE, NO ITEM BY NAME: "+str);}
}
async function RenewableItem(item="Paper",count=1,ms=1000){
	await delaywGameSpeed(ms);
	GiveItem(item,count);
	RenewableItem(item,count,ms);
}
function SetupItems(){	items=new Array(0);
	for(let i=0;i<regularItems.length;i++){items.push(new Item(name=regularItems[i]));}
	for(let i=0;i<stationsItems.length;i++){let it=new Item(name=stationsItems[i]);it.station=true;items.push(it);}
	items.sort();

	//Items Table
	let itemTable="<table>";
	for(let i=0;i<items.length/3;i++){
		itemTable+='<tr id="itemsRow'+i+'">';
		for(let j=0;j<3;j++){
			let id=(j+(3*i));
			itemTable+='<td class="tdItem" id="item'+id+'"></td>';
		}
		itemTable+='</tr>';
	}
	itemTable+="</table>";
	$("#itemsTable").append(itemTable);
	
	if(debug){console.log("%cItems: ","color: #006666");console.log(items);}
}
function DisplayItems(){
	if(debug){console.log("%cItems: ","color: #006666");console.log(items);}
	for(let i=0;i<items.length;i++){
		if(RecipeExists(items[i].name)){//if craftable
			$("#item"+i).html("<button class='tdButton' id='"+('item'+i)+"_bt'><img src='"+GetImg(items[i].name)+"'alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText' id='itemCount"+i+"'>"+items[i].count+"</span></button>");
			AddTooltip("#item"+i,items[i].name+GetAllRecipeIngredients(items[i].name));
			$("#item"+i+"_bt").on("click", CraftItem.bind(this,i));
		}else{
			$("#item"+i).html("<img src='"+GetImg(items[i].name)+"' alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText' id='itemCount"+i+"'>"+items[i].count+"</span>");
			AddTooltip("#item"+i,items[i].name);
		}
	}
}
function UpdateItems(){
	for(let i=0;i<items.length;i++){
		$("#itemCount"+i).html(items[i].count);
	}
}
function GetAllRecipeIngredients(str){	let r=GetRecipe(str);
	let ingr="";
	ingr+=" x"+r.count+"<br>";
	if(r.station!=""){if(r.stUses>0){ingr+="<span style='color:orange'>"+r.station+" x"+r.stUses+"</span><br>";}else{ingr+="<span style='color:yellow'>"+r.station+"</span><br>";}}
	if(r.item1!=""&&r.item1Cost>0){ingr+="<span style='color:grey'>"+r.item1+" x"+r.item1Cost+"</span>";}
	if(r.item2!=""&&r.item2Cost>0){ingr+="<br><span style='color:grey'>"+r.item2+" x"+r.item2Cost+"</span>";}
	if(r.item3!=""&&r.item3Cost>0){ingr+="<br><span style='color:grey'>"+r.item3+" x"+r.item3Cost+"</span>";}
	return ingr;
}
function GetRecipe(str){return recipes.find(x=>x.name==str);}
function RecipeExists(n){return recipes.some(e=>e.name===n);}
function RecipeAdd(
	name,count=1,
	station="",stUses=1,
	item1="",item1Cost=1,
	item2="",item2Cost=0,
	item3="",item3Cost=0
){recipes.push(new Recipe(name,count,station,stUses,item1,item1Cost,item2,item2Cost,item3,item3Cost));DisplayItems();}
function RecipeAddNS(
	name,count=1,
	item1="",item1Cost=1,
	item2="",item2Cost=0,
	item3="",item3Cost=0
){RecipeAdd(name,count,"",0,item1,item1Cost,item2,item2Cost,item3,item3Cost);}
function SetupRecipes(){	recipes=new Array(0);
	if(!reverseGameTest){
		RecipeAdd("Wood",1,"Compressor",1,"Paper",6);
		RecipeAdd("MetalFrags",3,"Campfire",1,"Scissors",1);
		
		RecipeAddNS("Compressor",4,"Rock",2);
		RecipeAddNS("Campfire",3,"Wood",4);
	}else{
		RecipeAddNS("Paper",6,"Wood",1);
		RecipeAddNS("Rock",1,"Wood",2);
		RecipeAddNS("Scissors",2,"Rock",3);
	}
	
	if(debug){console.log("%cRecipes: ","color: #1b427c");console.log(recipes);}
}
//UpdateFunc(UnlockableRecipes);
function UnlockableRecipes(){
	if(reverseGameTest){
		if(GetItem("Wood").count>=4&&!RecipeExists("Campfire"))RecipeAddNS("Campfire",3,"Wood",4);
		if(GetItem("Rock").count>=12&&!RecipeExists("Compressor"))RecipeAddNS("Compressor",4,"Rock",2);
		if(GetItem("MetalFrags").count>=1&&!RecipeExists("MetalFrags"))RecipeAdd("MetalFrags",3,"Campfire",1,"Scissors",1);
	}
}
function GiveStartingItems(){
	if(!reverseGameTest){
		if(itemsNeededToMove){
			GiveItem("Rock",10);
			GiveItem("Paper",10);
			GiveItem("Scissors",10);
		}
		GiveItem("Compressor",4);
		if(renewableStartItem)RenewableItem("Paper",1,renewableStartItemMs);
	}else{
		GiveItem("Rock",10);
		GiveItem("Paper",10);
		GiveItem("Scissors",10);
		if(renewableStartItem)RenewableItem("Wood",1,renewableStartItemMs);
	}
	if(cheatAllItems){
		for(let i=0;i<items.length;i++){GiveItemID(i,999);}
	}
}
function GiveItemsWin(wonAgainst){
	if(!reverseGameTest){
		let it="";
		switch(wonAgainst){
			case "Rock":it="Scissors";break;
			case "Paper":it="Rock";break;
			case "Scissors":it="Paper";break;
		}
		GiveItem(it);
	}else{
		let it="";
		switch(wonAgainst){
			case "Rock":it="MetalFrags";break;
			case "Paper":it="Campfire";break;
			case "Scissors":it="Rock";break;
		}
		GiveItem(it);
	}
}
function UseItemsLose(lostUsing){
	//if(!reverseGameTest){
		let it=lostUsing;
		/*switch(lostUsing){
			case "Rock":it="Rock";break;
			case "Paper":it="Paper";break;
			case "Scissors":it="Scissors";break;
		}*/
		UseItem(it);
	//}
}


function CraftItem(i){if(items[i]!=null){
	//if(debug)console.log(recipes);
	let r=GetRecipe(items[i].name);
	if(r!=null){
		if(r.item1!=""&&r.item2!=""&&r.item3!=""){//3 ingredients
			let itemResult=items.find(x=>x.name==r.name);
			let item1=items.find(x=>x.name==r.item1);
			let item2=items.find(x=>x.name==r.item2);
			let item3=items.find(x=>x.name==r.item3);
			let stItem="";if(r.station!="")stItem=items.find(x=>x.name==r.station);
			if(item1.count>=r.item1Cost
			&&item2.count>=r.item2Cost
			&&item3.count>=r.item3Cost
			){
			if(stItem==""||(stItem!=""&&((r.stUses==0&&stItem.count>=1)||(r.stUses>0&&stItem.count>=r.stUses)))){
				if(itemResult!=null){
					item1.count-=r.item1Cost;
					item2.count-=r.item2Cost;
					item3.count-=r.item3Cost;
					if(stItem!=""){stItem.count-=r.stUses;}
					itemResult.count+=r.count;
					console.log("Item crafted: "+itemResult.name+" x"+r.count+" times for "+r.item1Cost+"x "+item1.name+" | "+r.item2Cost+"x "+item2.name+" | "+r.item3Cost+"x "+item3.name+" || at "+r.station+" ("+r.stUses+"x uses)");
				}else{console.error("NO ITEM FOUND FOR: "+r.name);}
			}
			}
		}
		else if(r.item1!=""&&r.item2!="" &&r.item3==""){//2 ingredients
			let itemResult=items.find(x=>x.name==r.name);
			let item1=items.find(x=>x.name==r.item1);
			let item2=items.find(x=>x.name==r.item2);
			let stItem="";if(r.station!="")stItem=items.find(x=>x.name==r.station);
			if(item1.count>=r.item1Cost
			&&item2.count>=r.item2Cost
			){
			if(stItem==""||(stItem!=""&&((r.stUses==0&&stItem.count>=1)||(r.stUses>0&&stItem.count>=r.stUses)))){
				if(itemResult!=null){
					item1.count-=r.item1Cost;
					item2.count-=r.item2Cost;
					if(stItem!=""){stItem.count-=r.stUses;}
					itemResult.count+=r.count;
					console.log("Item crafted: "+itemResult.name+" x"+r.count+" times for "+r.item1Cost+"x "+item1.name+" | "+r.item2Cost+"x "+item2.name+" || at "+r.station+" ("+r.stUses+"x uses)");
				}else{console.error("NO ITEM FOUND FOR: "+r.name);}
			}
			}
		}
		else if(r.item1!="" &&r.item2==""&&r.item3==""){//1 ingredients
			let itemResult=items.find(x=>x.name==r.name);
			let item1=items.find(x=>x.name==r.item1);
			let stItem="";if(r.station!="")stItem=items.find(x=>x.name==r.station);
			if(item1.count>=r.item1Cost
			){
			if(stItem==""||(stItem!=""&&((r.stUses==0&&stItem.count>=1)||(r.stUses>0&&stItem.count>=r.stUses)))){
				if(itemResult!=null){
					item1.count-=r.item1Cost;
					if(stItem!=""){stItem.count-=r.stUses;}
					itemResult.count+=r.count;
					console.log("Item crafted: "+itemResult.name+" x"+r.count+" times for "+r.item1Cost+"x "+item1.name+" || at "+r.station+" ("+r.stUses+"x uses)");
				}else{console.error("NO ITEM FOUND FOR: "+r.name);}
			}
			}
		}
		else{//no ingredients, pure station
			let itemResult=items.find(x=>x.name==r.name);
			let stItem="";if(r.station!="")stItem=items.find(x=>x.name==r.station);
			if(stItem!=""&&((r.stUses==0&&stItem.count>=1)||(r.stUses>0&&stItem.count>=r.stUses))){
				if(itemResult!=null){
					if(stItem!=""){stItem.count-=r.stUses;}
					itemResult.count+=r.count;
					console.log("Item crafted: "+itemResult.name+" x"+r.count+" times for "+" || at "+r.station+" ("+r.stUses+"x uses)");
				}else{console.error("NO ITEM FOUND FOR: "+r.name);}
			}
		}
	}else{
		if(items[i]==null){console.error("NO ITEM FOUND BY ID: "+i);}
		else{console.error("NO RECIPE FOUND BY NAME: "+items[i].name);}
	}
	
	UpdateItems();
}}