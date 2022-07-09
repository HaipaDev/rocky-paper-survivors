function GiveItem(str,c=1){items.find(x=>x.name==str).count+=c;}
function GiveItemByID(i,c=1){items[i].count+=c;}
async function RenewableItem(item="Paper",count=1,ms=1000){
	await delay(ms);
	GiveItem(item,count);
	RenewableItem(item,count,ms);
	DisplayItems();
}
function SetupItems(){	items=new Array(0);
	console.log(regularItems);
	console.log(craftableItems);
	console.log(stationsItems);
	for(let i=0;i<regularItems.length;i++){items.push(new Item(name=regularItems[i]));}
	for(let i=0;i<craftableItems.length;i++){let it=new Item(name=craftableItems[i]);it.craftable=true;items.push(it);}
	for(let i=0;i<stationsItems.length;i++){let it=new Item(name=stationsItems[i]);it.station=true;items.push(it);}
	for(let i=0;i<craftableStationsItems.length;i++){items.find(x=>x.name==craftableStationsItems[i]).craftable=true;}
	items.sort();
	
	console.log(items);
}
function SetupRecipes(){	recipes=new Array(0);
	recipes.push(new Recipe(name="Wood",count=1,station="Compressor",stUses=1,item1="Paper",item1Cost=6));
	recipes.push(new Recipe(name="MetalFrags",count=5,station="Campfire",stUses=1,item1="Scissors",item1Cost=1));
	
	recipes.push(new Recipe(name="Compressor",count=4,station="",stUses=1,item1="Rock",item1Cost=2));
	recipes.push(new Recipe(name="Campfire",count=3,station="",stUses=1,item1="Wood",item1Cost=5));
	
	console.log(recipes);
}
function DisplayItems(){
	console.log(items);
	for(let i=0;i<items.length;i++){
		if(items[i].craftable){
			$("#item"+i).html("<button class='tdButton' id='"+('item'+i)+"_bt'><img src='"+GetImg(items[i].name)+"'alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText'>"+items[i].count+"</span></button>");
				/*let child=$("#item"+i).children("button").children("img");
				console.log(child);
				child.on('error',function handleError(){console.log(child.src);child.attr("src",(imgPath+"empty.png"));console.log(child.src);child.attr("style.visibility",'hidden');});*/
			$("#item"+i+"_bt").on("click", CraftItem.bind(this,i));
		}else{
			$("#item"+i).html("<img src='"+GetImg(items[i].name)+"' alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText'>"+items[i].count+"</span>");
				/*let child=$("#item"+i).children("img");
				console.log(child);
				child.on('error',function handleError(){console.log(child.src);child.attr("src",(imgPath+"empty.png"));console.log(child.src);child.attr("style.visibility",'hidden');});*/
		}
	}
}
function GiveStartingItems(){
	if(itemsNeededToMove){
		GiveItem("Rock",10);
		GiveItem("Paper",10);
		GiveItem("Scissors",10);
	}
	GiveItem("Compressor",5);
	
	if(renewablePaper)RenewableItem("Paper",1,renewablePaperMs);
}
function CraftItem(i){if(items[i]!=null){
	console.log(recipes);
	let recipe=recipes.find(x=>x.name==items[i].name);
	if(recipe!=null){
		if(recipe.item1!=""&&recipe.item2!=""&&recipe.item3!=""){//3 ingredients
			let item1=items.find(x=>x.name==recipe.item1);
			let item2=items.find(x=>x.name==recipe.item2);
			let item3=items.find(x=>x.name==recipe.item3);
			let itemResult=items.find(x=>x.name==recipe.name);
			let station="";if(recipe.station!="")station=items.find(x=>x.name==recipe.station);
			if(item1.count>=recipe.item1Cost
			&&item2.count>=recipe.item2Cost
			&&item3.count>=recipe.item3Cost
			){
			if(station==""||(station!=""&&station.count>=recipe.stUses)){
				if(itemResult!=null){
					item1.count-=recipe.item1Cost;
					item2.count-=recipe.item2Cost;
					item3.count-=recipe.item3Cost;
					if(station!=""){station.count-=recipe.stUses;}
					itemResult.count+=recipe.count;
					console.log("Item crafted: "+itemResult.name+" x"+recipe.count+" times for "+recipe.item1Cost+"x "+item1.name);
				}else{console.error("NO ITEM FOUND FOR: "+recipe.name);}
			}
			}
		}
		else if(recipe.item1!=""&&recipe.item2!=""&&recipe.item3==""){//2 ingredients
			let item1=items.find(x=>x.name==recipe.item1);
			let item2=items.find(x=>x.name==recipe.item2);
			let itemResult=items.find(x=>x.name==recipe.name);
			let station="";if(recipe.station!="")station=items.find(x=>x.name==recipe.station);
			if(item1.count>=recipe.item1Cost
			&&item2.count>=recipe.item2Cost
			){
			if(station==""||(station!=""&&station.count>=recipe.stUses)){
				if(itemResult!=null){
					item1.count-=recipe.item1Cost;
					item2.count-=recipe.item2Cost;
					if(station!=""){station.count-=recipe.stUses;}
					itemResult.count+=recipe.count;
					console.log("Item crafted: "+itemResult.name+" x"+recipe.count+" times for "+recipe.item1Cost+"x "+item1.name);
				}else{console.error("NO ITEM FOUND FOR: "+recipe.name);}
			}
			}
		}
		else if(recipe.item1!=""&&recipe.item2==""&&recipe.item3==""){//1 ingredients
			let item1=items.find(x=>x.name==recipe.item1);
			let itemResult=items.find(x=>x.name==recipe.name);
			let station="";if(recipe.station!="")station=items.find(x=>x.name==recipe.station);
			if(item1.count>=recipe.item1Cost
			){
			if(station==""||(station!=""&&station.count>=recipe.stUses)){
				if(itemResult!=null){
					item1.count-=recipe.item1Cost;
					if(station!=""){station.count-=recipe.stUses;}
					itemResult.count+=recipe.count;
					console.log("Item crafted: "+itemResult.name+" x"+recipe.count+" times for "+recipe.item1Cost+"x "+item1.name);
				}else{console.error("NO ITEM FOUND FOR: "+recipe.name);}
			}
			}
		}else{//no ingredients, pure station
			let itemResult=items.find(x=>x.name==recipe.name);
			let station="";if(recipe.station!="")station=items.find(x=>x.name==recipe.station);
			if(station!=""&&station.count>recipe.stUses){
				if(itemResult!=null){
					if(station!=""){station.count-=recipe.stUses;}
					itemResult.count+=recipe.count;
					console.log("Item crafted: "+itemResult.name+" x"+recipe.count+" times for "+item1Cost+"x "+item1.name);
				}else{console.error("NO ITEM FOUND FOR: "+recipe.name);}
			}
		}
	}else{
		if(items[i]==null){console.error("NO ITEM FOUND BY ID: "+i);}
		else{console.error("NO RECIPE FOUND BY NAME: "+items[i].name);}
	}
	
	DisplayItems();
}}