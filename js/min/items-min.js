"use strict";var Items={weapons:[],armor:[],consumables:[],all:[]},Pricing={rarities:{none:.5,common:1,rare:1.5,epic:2,legendary:2.5},types:{weapon:1,armor:.6,consumable:.4}},Item=function(e,n,o,r){this.name=e,this.level=n,this.rarity=o,this.flavorText=r};Item.prototype.use=function(){if(this.hasOwnProperty("effect")){for(var e=0;e<this.effect.length;e++)this.effect[e].run();Player.updateStats()}},Item.prototype.desc=function(){return this.effect.desc()},Item.prototype.getRarityMultiplier=function(){return Pricing.rarities[this.rarity]*Pricing.types[this.itemType]},Item.prototype.getSalePrice=function(){return 10*this.level*this.getRarityMultiplier()},Item.prototype.getPurchasePrice=function(){return 10*this.level*this.getRarityMultiplier()+5*this.level};var Weapon=function(e,n,o,r,t,a){var s=new Item(e,n,o,r);return s.damage=t,s.itemType="weapon",a&&(s.effect=a),s},Armor=function(e,n,o,r,t,a,s){var m=new Item(e,n,o,r);return m.slot=t,m.armorAmt=a,m.itemType="armor",s&&(m.effect=s),m},Consumable=function(e,n,o,r,t){var a=new Item(e,n,o,r);return a.effect=t,a.itemType="consumable",a};Items.weapons.push(new Weapon("Muddy Hatchet",1,"none","",[1,3]),new Weapon("Rusty Short Sword",1,"none","",[2,4]),new Weapon("Dull Axe",1,"none","",[1,5]),new Weapon("Wooden Staff",1,"none","",[2,3]),new Weapon("Bent Spear",1,"none","",[1,4]),new Weapon("Iron Dagger",1,"common","",[3,4]),new Weapon("Short Spear",1,"common","",[1,6]),new Weapon("Blacksmith Hammer",1,"common","",[2,5]),new Weapon("Bronze Short Sword",1,"common","",[3,4]),new Weapon("Rusty Battle Axe",2,"none","",[1,6]),new Weapon("Oak Club",2,"none","",[2,5]),new Weapon("Old Longsword",2,"none","",[3,4]),new Weapon("Logging Axe",2,"none","",[2,6]),new Weapon("Bronze Spear",2,"common","",[1,8]),new Weapon("Balanced Dagger",2,"rare","",[3,5],[addQuickness(1)]),new Weapon("Fang Claws",2,"common","",[2,7]),new Weapon("Iron Short Sword",2,"common","",[3,6]),new Weapon("Wind Blade",3,"rare","",[4,9],[quickStrike(2,15)]),new Weapon("Double Edged Katana",10,"epic","",[5,7],quickStrike(5,10)),new Weapon("Sadams Golden AK-47",20,"legendary","Complete with incendiary rounds",[77,133],[quickStrike(33,20)]),new Weapon("P-70 Stealthhawk",8,"epic","",[17,25],[addQuickness(8)]),new Weapon("Heartsbane",10,"legendary","A real heartbreaker",[7,13],[addQuickness(7),quickStrike(100,5)])),Items.armor.push(new Armor("Wool Shirt",1,"none","","chest",2),new Armor("Twine Cinch",1,"none","","belt",1),new Armor("Ragged Trousers",1,"none","","pants",1),new Armor("Damp Boots",1,"none","","boots",1),new Armor("Linen Shirt",1,"common","","chest",2,[addQuickness(1)]),new Armor("Leather Belt",1,"common","","belt",2),new Armor("Wool Cap",1,"common","","head",2),new Armor("Old Cloak",1,"common","","back",2),new Armor("Leather Sandals",1,"none","","boots",2),new Armor("Wool Sash",2,"none","","belt",2),new Armor("Old Canvas Pants",2,"none","","pants",2),new Armor("Skull Cap",2,"none","","head",2),new Armor("Thick Wool Shirt",2,"common","","chest",4),new Armor("Thick Leather Belt",2,"common","","belt",3),new Armor("Leather Hat",2,"common","","head",3),new Armor("Wool Cloak",2,"common","","back",3),new Armor("Travelers Boots",2,"common","","boots",3),new Armor("Centurian Cask",8,"epic","","head",18),new Armor("Arturus Tabard",10,"legendary","This belonged to a true badass.","chest",50,[addQuickness(10),addToughness(10)])),Items.consumables.push(new Consumable("Chicken Egg",1,"none","",[healPlayer(4)]),new Consumable("Peasant Bread",1,"none","",[healPlayer(5)]),new Consumable("Jerky",1,"common","",[healPlayer(6)]),new Consumable("Dried Trout",2,"none","",[healPlayer(8)]),new Consumable("Sharpsword Oil",2,"rare","",[buffMaxDamage(2)]),new Consumable("Whetstone",2,"common","",[buffMinDamage(1)]));var QuestItem=function(e,n,o,r){this.name=e,this.itemType="quest",this.rarity=n,this.flavorText=o,this.use=Item.prototype.use,this.effect=r};Items.all=Items.weapons.concat(Items.armor,Items.consumables),Items.all.push(new QuestItem("Message","epic",'The cover says: "To be delivered to Jawn Peteron"',[new QuestEffect("Click to read",'It reads "There used to be a graying tower alone on the sea." That\'s the opening lyric to Seal\'s "Kiss from a Rose." Curious.')]));