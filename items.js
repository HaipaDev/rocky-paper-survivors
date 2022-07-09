class Item{
	constructor(name="",count=0,station=false){
		this.name=name;
		this.count=count;
		this.station=station;
	}
}
class Recipe{
	constructor(name="",
	itemName="",count=1,
	chance=100,unlocked=true,unlockable=true,
	station="",stUses=1,
	item1="",item1Cost=1,
	item2="",item2Cost=0,
	item3="",item3Cost=0){
		this.name=name;
		this.itemName=itemName;
		this.count=count;
		this.chance=chance;
		this.unlocked=unlocked;
		this.unlockable=unlockable;
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
var items=new Array(0);
var recipes=new Array(0);

var regularItems;
var stationsItems;
var discoveredItems;
var discoveredRecipes;

function GetItem(str){let it=new Item("",0);if(items.find(x=>x.name==str)!=null)it=items.find(x=>x.name==str);return it;}
function GetItemIDFromName(str){let id=0;id=items.findIndex(x=>x.name==str);return id;}
function ItemExists(str){return GetItem(str).name!="";}
function GiveItem(str,c=1){
	if(ItemExists(str)){let it=GetItem(str);
		it.count+=c;console.log("%cGiving item: "+str+" x"+c,"color: #327212");DiscoverItem(it.name);UpdateItems();}
	else{console.warn("CANT GIVE, NO ITEM BY NAME: "+str);}
}
function GiveItemID(id,c=1){let it=items[id];if(it!==null){it.count+=c;console.log("%cGiving item(ID: "+id+"): "+items[id].name+" x"+c,"color: #327212");DiscoverItem(items[id].name);UpdateItems();}else{console.warn("CANT GIVE, NO ITEM BY ID: "+id);}}
function UseItem(str,c=1){
	if(ItemExists(str)){let it=GetItem(str);
		if(it.count>=c){it.count-=c;console.log("%cUsing item: "+str+" x"+c+" time","color: #810404");UpdateItems();}
		else{console.warn("TRYING TO USE MORE("+c+") ITEMS THAN THERE ARE("+it.count+") FOR: "+str);}
	}else{console.warn("CANT USE, NO ITEM BY NAME: "+str);}
}
async function RenewableItem(item="Paper",count=1,ms=1000){
	if(renewableStartItem){
		await delaywGameSpeed(ms);
		GiveItem(item,count);
		RenewableItem(item,count,ms);
	}
}
function DiscoverItem(str){if(!discoveredItems.some(x=>x==str)){discoveredItems.push(str);console.log("Discovered Item: "+str);DisplayItems();}}
function DiscoverRecipe(str){if(!discoveredRecipes.some(x=>x==str)){discoveredRecipes.push(str);console.log("Discovered Recipe: "+str);DisplayItems();}}

function SetupItems(){	items=new Array(0);discoveredItems=new Array(0);
	if(classicGameRules){
		regularItems=["Rock","Paper","Scissors","Wood","MetalFrags"];
		stationsItems=["Compressor","Campfire"];
	}else{
		regularItems=["Rock","Paper","Scissors","Wood","MetalFrags"];
		stationsItems=["Axe","Compressor","Campfire","Pickaxe","Metal Axe"];
	}

	for(let i=0;i<regularItems.length;i++){items.push(new Item(name=regularItems[i]));}
	for(let i=0;i<stationsItems.length;i++){let it=new Item(name=stationsItems[i]);it.station=true;items.push(it);}
	items.sort();
	if(debug){console.log("%cItems: ","color: #006666");console.log(items);}

	//Items Table
	let itemTable="<table>";
	let itemsNSList=items.filter(x=>!x.station);
	//let discoveredItemsList=itemsNSList;if(hideUndiscoveredItems)discoveredItemsList=discoveredItemsList.filter(x=>discoveredItems.includes(x.name));console.log(discoveredItemsList);
	//let discoveredStationsList=stationsList;if(hideUndiscoveredStations)discoveredStationsList=discoveredStationsList.filter(x=>discoveredItems.includes(x.name));
	for(let i=0;i<itemsNSList.length/itemsTableWidth;i++){
		itemTable+='<tr id="itemsRow'+i+'">';
		for(let j=0;j<itemsTableWidth;j++){
			let id=(j+(itemsTableWidth*i));
			itemTable+='<td class="tdItem" id="item'+id+'"></td>';
		}
		itemTable+='</tr>';
	}
	itemTable+="</table>";
	$("#itemsTable").append(itemTable);

	//Stations Table
	let stationsTable="<table>";
	let stationsList=new Array(0);stationsList.push(new Item("Hand","",true));stationsList=stationsList.concat(items.filter(x=>x.station));
	for(let i=0;i<stationsList.length/itemsTableWidth;i++){
		stationsTable+='<tr id="stationsRow'+i+'">';
		for(let j=0;j<itemsTableWidth;j++){
			let id=(j+(itemsTableWidth*i));
			stationsTable+='<td class="tdItem" id="station'+id+'"></td>';
		}
		stationsTable+='</tr>';
	}
	stationsTable+="</table>";
	$("#stationsTable").append(stationsTable);
}
function DisplayItems(){
	//if(debug){console.log("%cItems: ","color: #006666");console.log(items);}
	let itemsNSList=items.filter(x=>!x.station);
	let discoveredItemsList=itemsNSList;if(hideUndiscoveredItems)discoveredItemsList=discoveredItemsList.filter(x=>discoveredItems.includes(x.name));
	let stationsList=new Array(0);stationsList.push(new Item("Hand","",true));stationsList=stationsList.concat(items.filter(x=>x.station));
	let discoveredStationsList=stationsList;if(hideUndiscoveredStations)discoveredStationsList=discoveredStationsList.filter(x=>discoveredItems.includes(x.name));
	
	for(let i=0;i<discoveredItemsList.length;i++){
		$("#item"+i).html("<img src='"+GetImg(discoveredItemsList[i].name)+"' alt="+discoveredItemsList[i].name+" class='tdImg'>"+"<br>\
			<span class='tdText' id='itemCount"+GetItemIDFromName(discoveredItemsList[i].name)+"'>"+discoveredItemsList[i].count+"</span>");
		AddTooltip("#item"+i,discoveredItemsList[i].name);
	}
	for(let i=0;i<discoveredStationsList.length;i++){
		$("#station"+i).html("<button class='tdButton' id='"+('station'+i)+"_bt'>\
			<img src='"+GetImg(discoveredStationsList[i].name)+"' alt="+discoveredStationsList[i].name+" class='tdImg'>"+"<br>\
				<span class='tdText' id='itemCount"+GetItemIDFromName(discoveredStationsList[i].name)+"'>"+SpecialNumbers(discoveredStationsList[i].count)+"</span></button>");
		AddTooltip("#station"+i,discoveredStationsList[i].name);
		$("#station"+i+"_bt").on("click", SelectStation.bind(this,discoveredStationsList[i].name));
		if(lockSelectingNotOwnedStations){
			$("#station"+i+"_bt").removeClass("unownedStation");
			if(discoveredStationsList[i].count<=0&&!_isSpecialNumber(discoveredStationsList[i].count)&&discoveredStationsList[i].name!="Hand")$("#station"+i+"_bt").addClass("unownedStation");
		}
	}
	SelectStation(selectedStation);

	/*for(let i=0;i<items.length;i++){
		if(RecipeExists(items[i].name)){//if craftable
			if(GetRecipe(items[i].name).unlocked){//if unlocked
				$("#item"+i).html("<button class='tdButton' id='"+('item'+i)+"_bt'><img src='"+GetImg(items[i].name)+"'alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText' id='itemCount"+i+"'>"+items[i].count+"</span></button>");
				AddTooltip("#item"+i,items[i].name+GetAllRecipeIngredients(items[i].name));
				$("#item"+i+"_bt").on("click", CraftItem.bind(this,i));
			}else if(_isRecipeUnlockableLocked(items[i].name)){//if unlockable and locked
				$("#item"+i).html("<img src='"+GetImg(items[i].name)+"' alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText' id='itemCount"+i+"'>"+items[i].count+"</span>");
				AddTooltip("#item"+i,items[i].name+"<br><span style='color:grey'>Locked</span>");
			}
		}else{
			$("#item"+i).html("<img src='"+GetImg(items[i].name)+"' alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText' id='itemCount"+i+"'>"+items[i].count+"</span>");
			AddTooltip("#item"+i,items[i].name);
		}
	}*/
}
function UpdateItems(){for(let i=0;i<items.length;i++){$("#itemCount"+i).html(SpecialNumbers(items[i].count));}}

function SelectStation(str){
	if(!lockSelectingNotOwnedStations||(lockSelectingNotOwnedStations&&(GetItem(str).count>0||GetItem(str).count==-5||str=="Hand"))){
		selectedStation=str;
		let craftablesTable="<table>";
		let stationsList=new Array(0);stationsList.push(new Item("Hand","",true));stationsList=stationsList.concat(items.filter(x=>x.station));
		let discoveredStationsList=stationsList;if(hideUndiscoveredStations)discoveredStationsList=discoveredStationsList.filter(x=>discoveredItems.includes(x.name));

		let craftablesForThisStationList=recipes.filter(x=>x.station==selectedStation||(x.station==""&&selectedStation=="Hand"));
		let craftableItems=craftablesForThisStationList;if(hideLockedRecipes)craftableItems=craftableItems.filter(x=>x.unlocked);
		let discoveredCraftables=craftableItems;if(hideUndiscoveredRecipes)discoveredCraftables=discoveredCraftables.filter(x=>discoveredRecipes.includes(x.name));

		for(let i=0;i<craftableItems.length/itemsTableWidth;i++){
			craftablesTable+='<tr id="craftablesRow'+i+'">';
			for(let j=0;j<itemsTableWidth;j++){
				let id=(j+(itemsTableWidth*i));
				craftablesTable+='<td class="tdItem" id="craft'+id+'"></td>';
			}
			craftablesTable+='</tr>';
		}
		craftablesTable+="</table>";
		$("#craftablesTable").empty();
		$("#craftablesTable").append(craftablesTable);

		for(let i=0;i<discoveredCraftables.length;i++){
			if(discoveredCraftables[i].unlocked){
				$("#craft"+i).html("<button class='tdButton' id='"+('craft'+i)+"_bt'>\
					<img src='"+GetImg(discoveredCraftables[i].itemName)+"' alt="+discoveredCraftables[i].itemName+" class='tdImg'>"+"<br>\
						<span class='tdText'>"+GetRecipe(discoveredCraftables[i].name).count+"</span></button>");
				AddTooltip("#craft"+i,discoveredCraftables[i].itemName+GetAllRecipeIngredients(discoveredCraftables[i].name));
				$("#craft"+i+"_bt").on("click", CraftItem.bind(this,discoveredCraftables[i].name));
			}else{
				$("#craft"+i).html("<img src='"+GetImg(discoveredCraftables[i].itemName)+"' alt="+discoveredCraftables[i].itemName+" class='tdImg'>"+"<br>\
						<span class='tdText'>"+GetRecipe(discoveredCraftables[i].name).count+"</span>");
				AddTooltip("#craft"+i,discoveredCraftables[i].itemName+GetAllRecipeIngredients(discoveredCraftables[i].name));
			}
		}
		for(let i=0;i<discoveredStationsList.length;i++){
			$("#station"+i+"_bt").removeClass("selectedStation");
			if(selectedStation==discoveredStationsList[i].name){$("#station"+i+"_bt").addClass("selectedStation");}
		}
	}
}


function GetAllRecipeIngredients(str){	let r=GetRecipe(str);
	let ingr="";
	ingr+=" x"+SpecialNumbers(r.count);
	if(r.unlocked||!hideLockedRecipesIngredients){
		if(displayChanceInIngredients){if(r.chance<100&&r.chance>0){ingr+="&nbsp;<span style='color:"+GetColorBasedOnChance(r.chance)+"'>"+r.chance+"%</span>";}}
		if(displayStationInIngredients){if(r.station!=""){if(r.stUses>0){ingr+="<br><span style='color:orange'>"+r.station+" x"+r.stUses+"</span><br>";}else{ingr+="<br><span style='color:yellow'>"+r.station+"</span><br>";}}}
			else{ingr+="<br>";}
		if(r.item1!=""&&r.item1Cost>0){ingr+="<span style='color:grey'>"+r.item1+" x"+r.item1Cost+"</span>";}
		if(r.item2!=""&&r.item2Cost>0){ingr+="<br><span style='color:grey'>"+r.item2+" x"+r.item2Cost+"</span>";}
		if(r.item3!=""&&r.item3Cost>0){ingr+="<br><span style='color:grey'>"+r.item3+" x"+r.item3Cost+"</span>";}
	}else if(!r.unlocked&&hideLockedRecipesIngredients){
		ingr+="<br><span style='color:grey'>Locked</span>";
	}
	return ingr;
}

function GetRecipe(str){return recipes.find(x=>x.name==str);}
function RecipeExists(n){return recipes.some(x=>x.name===n);}
function _isRecipeUnlockableLocked(str){return recipes.some(x=>x.name==str&&!x.unlocked&&x.unlockable);}

function RecipeAdd(
	name,itemName,count=1,
	chance=100,
	station="",stUses=1,
	item1="",item1Cost=1,
	item2="",item2Cost=0,
	item3="",item3Cost=0
){let itemNameSet=itemName;if(itemName==""){itemNameSet=name;}let chanceSet=chance;if(chance<0)chanceSet=1;else if(chance>100||chance==0)chanceSet=100;
	recipes.push(new Recipe(name,itemNameSet,count,chanceSet,true,false,station,stUses,item1,item1Cost,item2,item2Cost,item3,item3Cost));DisplayItems();}
function RecipeAdd_L(name,itemName,count,chance,station,stUses,item1,item1Cost,item2,item2Cost,item3,item3Cost){RecipeAdd(name,itemName,count,chance,station,stUses,item1,item1Cost,item2,item2Cost,item3,item3Cost);let r=GetRecipe(name);r.unlocked=false;r.unlockable=true;}
//function RecipeAdd_DIF(name,itemName,count,station,stUses,item1,item1Cost,item2,item2Cost,item3,item3Cost){RecipeAdd(name,itemName,count,100,station,stUses,item1,item1Cost,item2,item2Cost,item3,item3Cost);}
//function RecipeAdd_DIF_L(name,itemName,count,station,stUses,item1,item1Cost,item2,item2Cost,item3,item3Cost){RecipeAddDIF(name,itemName,count,100,station,stUses,item1,item1Cost,item2,item2Cost,item3,item3Cost);let r=GetRecipe(name);r.unlocked=false;r.unlockable=true;}

function RecipeAdd_NS(
	name,itemName,count=1,
	chance=100,
	item1="",item1Cost=1,
	item2="",item2Cost=0,
	item3="",item3Cost=0
){RecipeAdd(name,itemName,count,chance,"",0,item1,item1Cost,item2,item2Cost,item3,item3Cost);}
function RecipeAdd_NS_L(name,itemName,count,chance,item1,item1Cost,item2,item2Cost,item3,item3Cost){RecipeAdd_NS(name,itemName,count,chance,item1,item1Cost,item2,item2Cost,item3,item3Cost);let r=GetRecipe(name);r.unlocked=false;r.unlockable=true;}
//function RecipeAdd_NS_DIF(name,itemName,count,item1,item1Cost,item2,item2Cost,item3,item3Cost){RecipeAdd(name,itemName,count,100,"",0,item1,item1Cost,item2,item2Cost,item3,item3Cost);let r=GetRecipe(name);r.unlocked=false;r.unlockable=true;}
//function RecipeAdd_NS_DIF_L(name,itemName,count,item1,item1Cost,item2,item2Cost,item3,item3Cost){RecipeAdd(name,itemName,count,100,"",0,item1,item1Cost,item2,item2Cost,item3,item3Cost);let r=GetRecipe(name);r.unlocked=false;r.unlockable=true;}

function RecipeRemove(name){recipes.splice(recipes.indexOf(x=>x.name==name));console.log("Removed Recipe for: "+name);DisplayItems();}
function RecipeUnlock(name){if(_isRecipeUnlockableLocked(name)){GetRecipe(name).unlocked=true;console.log("Unlocked Recipe for: "+name);DiscoverRecipe(name);DisplayItems();SelectStation(selectedStation);}}
function RecipeLock(name){if(!_isRecipeUnlockableLocked(name)){GetRecipe(name).unlocked=false;console.log("Locked Recipe for: "+name);DisplayItems();SelectStation(selectedStation);}}

function SetupRecipes(){	recipes=new Array(0);discoveredRecipes=new Array(0);
	if(classicGameRules){
		RecipeAdd("Wood","",1,100,"Compressor",1,"Paper",6);
		RecipeAdd("MetalFrags","",3,100,"Campfire",1,"Scissors",1);
		
		RecipeAdd_NS("Compressor","",4,100,"Rock",2);
		RecipeAdd_NS("Campfire","",3,100,"Wood",4);
	}else{
		RecipeAdd("Wood","",1,100,"Axe",0);

		RecipeAdd("Paper","",3,100,"Axe",0,"Wood",1);
		RecipeAdd("Rock","",1,100,"Pickaxe",1);
		RecipeAdd("Scissors","",2,100,"Compressor",1,"MetalFrags",2);
		RecipeAdd_L("MetalFrags","",3,100,"Campfire",1,"Scissors",1);

		RecipeAdd_NS_L("Compressor","",4,100,"Rock",2);
		RecipeAdd_NS_L("Campfire","",3,100,"Wood",4);
		RecipeAdd_NS_L("Metal Axe","",16,100,"MetalFrags",15,"Wood",6);
		RecipeAdd_NS_L("Pickaxe","",10,100,"Rock",3,"Wood",3);

		RecipeAdd_L("Wood-MetalAxe","Wood",5,75,"Metal Axe",1);
	}

	for(let i=0;i<recipes.length;i++){
		if(recipes[i].unlocked){DiscoverRecipe(recipes[i].name);}
	}
	
	if(debug){console.log("%cRecipes: ","color: #1b427c");console.log(recipes);}
}
function UnlockableRecipes(){
	if(!classicGameRules){
		if(GetItem("Wood").count>=4)RecipeUnlock("Campfire");
		if(GetItem("Rock").count>=5)RecipeUnlock("Compressor");
		if(GetItem("Campfire").count>=1)RecipeUnlock("MetalFrags");
		if(GetItem("Rock").count>=5&&GetItem("Wood").count>=3)RecipeUnlock("Pickaxe");
		if(GetItem("MetalFrags").count>=12)RecipeUnlock("Metal Axe");
		if(GetItem("Metal Axe").count>=1)RecipeUnlock("Wood-MetalAxe");
	}
}
function AutoRemoveRecipesWhenItemNotExist(){
	for(let i=0;i<recipes.length;i++){	let r=recipes[i];
		if((r.item1!=""&&!ItemExists(r.item1))||(r.item2!=""&&!ItemExists(r.item2))||(r.item3!=""&&!ItemExists(r.item3)))RecipeRemove(r.name);
	}
}

function GiveStartingItems(){
	if(!BaseItemsExist()){itemsNeededToMove=false;itemAlwaysUsedOnMove=false;console.warn("BASE ITEM IS MISSING");}

	if(classicGameRules){
		if(itemsNeededToMove){
			GiveItem("Rock",10);
			GiveItem("Paper",10);
			GiveItem("Scissors",10);
		}
		GiveItem("Compressor",4);
		RenewableItem("Paper",1,renewableStartItemMs);
	}else{
		GiveItem("Axe",-5);

		GiveItem("Rock",3);
		GiveItem("Paper",3);
		GiveItem("Scissors",3);
		renewableStartItem=false;
		RenewableItem("Wood",1,renewableStartItemMs);
	}
	if(discoverAllItems)DiscoverAllItems();
	if(cheatAllItems)CheatAllItems();
	if(unlockAllRecipes)UnlockAllRecipes();
}
function GiveItemsWin(wonAgainst){
	//if(classicGameRules){
		let it="";
		switch(wonAgainst){
			case "Rock":it="Scissors";break;
			case "Paper":it="Rock";break;
			case "Scissors":it="Paper";break;
		}
		GiveItem(it);
	/*}else{
		let it="";
		switch(wonAgainst){
			case "Rock":it="MetalFrags";break;
			case "Paper":it="Campfire";break;
			case "Scissors":it="Rock";break;
		}
		GiveItem(it);
	}*/
}
function UseItemsLose(lostUsing){
	//if(classicGameRules){
		let it=lostUsing;
		/*switch(lostUsing){
			case "Rock":it="Rock";break;
			case "Paper":it="Paper";break;
			case "Scissors":it="Scissors";break;
		}*/
		UseItem(it);
	//}
}
function BaseItemsExist(){return (ItemExists("Rock")&&ItemExists("Paper")&&ItemExists("Scissors"));}

function DiscoverAllItems(){for(let i=0;i<items.length;i++){DiscoverItem(items[i].name);}}
function CheatAllItems(){for(let i=0;i<items.length;i++){GiveItemID(i,999);}}
function UnlockAllRecipes(){for(let i=0;i<recipes.length;i++){RecipeUnlock(recipes[i].name);}}

function CraftItem(name){
	//if(debug)console.log(recipes);
	let rnd=Randomize();
	let r=GetRecipe(name);
	if(r!=null){
		if(r.item1!=""&&r.item2!=""&&r.item3!=""){//3 ingredients
			let itemResult=items.find(x=>x.name==r.itemName);
			let item1=items.find(x=>x.name==r.item1);
			let item2=items.find(x=>x.name==r.item2);
			let item3=items.find(x=>x.name==r.item3);
			let stItem="";if(r.station!="")stItem=items.find(x=>x.name==r.station);
			if(item1.count>=r.item1Cost
			&&item2.count>=r.item2Cost
			&&item3.count>=r.item3Cost
			){
			if(stItem==""||(stItem!=""&&((r.stUses==0&&stItem.count>=1||stItem.count==-5)||(r.stUses>0&&stItem.count>=r.stUses)))){
				if(itemResult!=null){
					item1.count-=r.item1Cost;
					item2.count-=r.item2Cost;
					item3.count-=r.item3Cost;
					if(stItem!=""){stItem.count-=r.stUses;}
					if(rnd<=r.chance){
						itemResult.count+=r.count;DiscoverItem(itemResult.name);
						console.log("Item crafted: "+itemResult.name+" x"+r.count+" times for "+r.item1Cost+"x "+item1.name+" | "+r.item2Cost+"x "+item2.name+" | "+r.item3Cost+"x "+item3.name+" || at "+r.station+" ("+r.stUses+"x uses)");
					}else{console.log("Item could not be crafted ("+rnd+" / "+r.chance+"), wasted: "+r.item1Cost+"x "+item1.name+" | "+r.item2Cost+"x "+item2.name+" | "+r.item3Cost+"x "+item3.name+" || at "+r.station+" ("+r.stUses+"x uses)");}
				}else{console.warn("NO ITEM FOUND FOR: "+r.itemName);}
			}
			}
		}
		else if(r.item1!=""&&r.item2!="" &&r.item3==""){//2 ingredients
			let itemResult=items.find(x=>x.name==r.itemName);
			let item1=items.find(x=>x.name==r.item1);
			let item2=items.find(x=>x.name==r.item2);
			let stItem="";if(r.station!="")stItem=items.find(x=>x.name==r.station);
			if(item1.count>=r.item1Cost
			&&item2.count>=r.item2Cost
			){
			if(stItem==""||(stItem!=""&&((r.stUses==0&&stItem.count>=1||stItem.count==-5)||(r.stUses>0&&stItem.count>=r.stUses)))){
				if(itemResult!=null){
					item1.count-=r.item1Cost;
					item2.count-=r.item2Cost;
					if(stItem!=""){stItem.count-=r.stUses;}
					if(rnd<=r.chance){
						itemResult.count+=r.count;DiscoverItem(itemResult.name);
						console.log("Item crafted: "+itemResult.name+" x"+r.count+" times for "+r.item1Cost+"x "+item1.name+" | "+r.item2Cost+"x "+item2.name+" || at "+r.station+" ("+r.stUses+"x uses)");
					}else{console.log("Item could not be crafted ("+rnd+" / "+r.chance+"), wasted: "+r.item1Cost+"x "+item1.name+" | "+r.item2Cost+"x "+item2.name+" || at "+r.station+" ("+r.stUses+"x uses)");}
				}else{console.warn("NO ITEM FOUND FOR: "+r.itemName);}
			}
			}
		}
		else if(r.item1!="" &&r.item2==""&&r.item3==""){//1 ingredients
			let itemResult=items.find(x=>x.name==r.itemName);
			let item1=items.find(x=>x.name==r.item1);
			let stItem="";if(r.station!="")stItem=items.find(x=>x.name==r.station);
			if(item1.count>=r.item1Cost
			){
			if(stItem==""||(stItem!=""&&((r.stUses==0&&stItem.count>=1||stItem.count==-5)||(r.stUses>0&&stItem.count>=r.stUses)))){
				if(itemResult!=null){
					item1.count-=r.item1Cost;
					if(stItem!=""){stItem.count-=r.stUses;}
					if(rnd<=r.chance){
						itemResult.count+=r.count;DiscoverItem(itemResult.name);
						console.log("Item crafted: "+itemResult.name+" x"+r.count+" times for "+r.item1Cost+"x "+item1.name+" || at "+r.station+" ("+r.stUses+"x uses)");
					}else{console.log("Item could not be crafted ("+rnd+" / "+r.chance+"), wasted: "+r.item1Cost+"x "+item1.name+" || at "+r.station+" ("+r.stUses+"x uses)");}
				}else{console.warn("NO ITEM FOUND FOR: "+r.itemName);}
			}
			}
		}
		else{//no ingredients, pure station
			let itemResult=items.find(x=>x.name==r.itemName);
			let stItem="";if(r.station!="")stItem=items.find(x=>x.name==r.station);
			if(stItem!=""&&((r.stUses==0&&stItem.count>=1||stItem.count==-5)||(r.stUses>0&&stItem.count>=r.stUses))){
				if(itemResult!=null){
					if(stItem!=""){stItem.count-=r.stUses;}
					if(rnd<=r.chance){
						itemResult.count+=r.count;DiscoverItem(itemResult.name);
						console.log("Item crafted: "+itemResult.name+" x"+r.count+" times "+"at "+r.station+" ("+r.stUses+"x uses)");
					}else{console.log("Item could not be crafted ("+rnd+" / "+r.chance+"), wasted: "+r.station+" ("+r.stUses+"x uses)");}
				}else{console.warn("NO ITEM FOUND FOR: "+r.itemName);}
			}
		}
	}else{console.warn("NO RECIPE FOUND BY NAME: "+name);}
	DisplayItems();
}