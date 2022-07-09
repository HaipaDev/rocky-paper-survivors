function GiveItem(str,c=1){items.find(x=>x.name==str).count+=c;}
function GiveItemByID(i,c=1){items[i].count+=c;}
function SetupItems(){	items=new Array(0);
	//let allItemCount=regularItems.length+craftableItems.length+stationsItems.length;
	//items=new Array(allItemCount);
	//for(let i=0;i<allItemCount;i++){items[i]=new Item();}//items[i].name="";}
	console.log(regularItems);
	console.log(craftableItems);
	console.log(stationsItems);
	/*for(let i=0,j=0;i<allItemCount;i++,j++){	let n="";
		if(items[i].name===""||items[i].name===undefined){
			for(j=0;j<regularItems.length;j++){items[i].name=regularItems[j].name;}
			for(j=0;j<craftableItems.length;j++){items[i].name=craftableItems[j].name;}
			for(j=0;j<stationsItems.length;j++){items[i].name=stationsItems[j].name;}
		}
	}*/
	for(let i=0;i<regularItems.length;i++){items.push(new Item(name=regularItems[i]));}
	for(let i=0;i<craftableItems.length;i++){let it=new Item(name=craftableItems[i]);it.craftable=true;items.push(it);}
	for(let i=0;i<stationsItems.length;i++){let it=new Item(name=stationsItems[i]);it.station=true;items.push(it);}
	for(let i=0;i<craftableStationsItems.length;i++){items.find(x=>x.name==craftableStationsItems[i]).craftable=true;}
	
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
		if(items[i].craftable){$("#item"+i).html("<button class='tdButton' id='"+('item'+i)+"_bt'><img src='"+GetImg(items[i].name)+"'alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText'>"+items[i].count+"</span></button>");}
		else{$("#item"+i).html("<img src='"+GetImg(items[i].name)+"' alt="+items[i].name+" class='tdImg'>"+"<br><span class='tdText'>"+items[i].count+"</span>");}
		
		if(items[i].craftable){$("#item"+i+"_bt").on("click", CraftItem.bind(this,i));}
	}
}
function GiveStartingItems(){
	GiveItem("Rock",99);//temp
	GiveItem("Paper",99);//temp
	GiveItem("Scissors",99);//temp
	GiveItem("Compressor",5);
}
function CraftItem(i){if(items[i]!=null){
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
					item1.count-=item1Cost;
					item2.count-=item2Cost;
					item3.count-=item3Cost;
					if(station!=""){station.count-=recipe.stUses;}
					itemResult.count+=recipe.count;
					console.log("Item crafted: "+itemResult.name+" x"+recipe.count+" times");
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
					item1.count-=item1Cost;
					item2.count-=item2Cost;
					if(station!=""){station.count-=recipe.stUses;}
					itemResult.count+=recipe.count;
					console.log("Item crafted: "+itemResult.name+" x"+recipe.count+" times");
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
					item1.count-=item1Cost;
					if(station!=""){station.count-=recipe.stUses;}
					itemResult.count+=recipe.count;
					console.log("Item crafted: "+itemResult.name+" x"+recipe.count+" times");
				}else{console.error("NO ITEM FOUND FOR: "+recipe.name);}
			}
			}
		}
		else{//no ingredients, pure station
			let itemResult=items.find(x=>x.name==recipe.name);
			let station="";if(recipe.station!="")station=items.find(x=>x.name==recipe.station);
			if(station!=""&&station.count>recipe.stUses){
				if(itemResult!=null){
					if(station!=""){station.count-=recipe.stUses;}
					itemResult.count+=recipe.count;
					console.log("Item crafted: "+itemResult.name+" x"+recipe.count+" times");
				}else{console.error("NO ITEM FOUND FOR: "+recipe.name);}
			}
		}
	}else{
		if(items[i]==null){console.error("NO ITEM FOUND BY ID: "+i);}
		else{console.error("NO RECIPE FOUND BY NAME: "+items[i].name);}
	}
	
	DisplayItems();
}}