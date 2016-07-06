'use strict';

var Weapons = [];
var Armors = [];
var Consumables = [];

var Pricing = {
	rarities: {
		'none': 0.5,
		'common': 1,
		'rare': 1.5,
		'epic': 2,
		'legendary': 2.5
	},
	types: {
		'weapon': 1,
		'armor': 0.6,
		'consumable': 0.4
	}
};

var Item = function(name, level, rarity, flavorText) {
	this.name = name;
	this.level = level;
	this.rarity = rarity;
	this.flavorText = flavorText;
};

Item.prototype.use = function() {
	if(this.hasOwnProperty('effect')) {
		for(var i = 0; i < this.effect.length; i++) {
				this.effect[i].run();
		}
		Player.updateStats();
	}
};

Item.prototype.desc = function() {
	return this.effect.desc();
};

Item.prototype.getRarityMultiplier = function() {
	return Pricing.rarities[this.rarity] * Pricing.types[this.itemType];
};

Item.prototype.getSalePrice = function() {
	return (this.level*10) * this.getRarityMultiplier();
};

Item.prototype.getPurchasePrice = function() {
	return (this.level*10) * this.getRarityMultiplier() + (this.level*5);
};

var Weapon = function(name, level, rarity, flavorText, damage, effects){
	var weapon = new Item(name,level, rarity, flavorText);
	weapon.damage = damage;
	weapon.itemType = 'weapon';
	if(effects) {
		weapon.effect = effects;
	}
	return weapon;
};

var Armor = function(name, level, rarity, flavorText, slot, armorAmt, effects) {
	var armor = new Item(name,level, rarity, flavorText);
	armor.slot = slot;
	armor.armorAmt = armorAmt;
	armor.itemType = 'armor';
	if(effects) {
		armor.effect = effects;
	}
	return armor;
};

var Consumable = function(name, level, rarity, flavorText, effects){
	var consumable = new Item(name,level, rarity, flavorText);
	consumable.effect = effects;
	consumable.itemType = 'consumable';
	return consumable;
};

Weapons.push(new Weapon('Muddy Hatchet', 1, 'none', '', [1, 3]));
Weapons.push(new Weapon('Rusty Short Sword', 1, 'none', '', [2, 4]));
Weapons.push(new Weapon('Dull Axe', 1, 'none', '', [1, 5]));
Weapons.push(new Weapon('Wooden Staff', 1, 'none', '', [2, 3]));
Weapons.push(new Weapon('Bent Spear', 1, 'none', '', [1, 4]));
Weapons.push(new Weapon('Iron Dagger', 1, 'common', '', [3, 4]));
Weapons.push(new Weapon('Short Spear', 1, 'common', '', [1, 6]));
Weapons.push(new Weapon('Blacksmith Hammer', 1, 'common', '', [2, 5]));
Weapons.push(new Weapon('Bronze Short Sword', 1, 'common', '', [3, 4]));

Weapons.push(new Weapon('Rusty Battle Axe', 2, 'none', '', [1, 6]));
Weapons.push(new Weapon('Oak Club', 2, 'none', '', [2, 5]));
Weapons.push(new Weapon('Old Longsword', 2, 'none', '', [3, 4]));
Weapons.push(new Weapon('Logging Axe', 2, 'none', '', [2, 6]));
Weapons.push(new Weapon('Bronze Spear', 2, 'common', '', [1, 8]));
Weapons.push(new Weapon('Balanced Dagger', 2, 'rare', '', [3, 5], [addQuickness(1)]));
Weapons.push(new Weapon('Fang Claws', 2, 'common', '', [2, 7]));
Weapons.push(new Weapon('Iron Short Sword', 2, 'common', '', [3, 6]));

Weapons.push(new Weapon('Wind Blade', 3, 'rare', '', [4, 9], [quickStrike(2, 15)]));
Weapons.push(new Weapon('Sword of Saladin', 15, 'legendary', 'It can cut a scarf in the air.', [30, 60], [addQuicknessAndStrength(20)]));
Weapons.push(new Weapon('Double Edged Katana', 10, 'epic', '', [5, 7], quickStrike(5, 10)));
Weapons.push(new Weapon('Sadams Golden AK-47', 20, 'legendary', 'Complete with incendiary rounds', [77, 133], [quickStrike(33, 20)]));
Weapons.push(new Weapon('P-70 Stealthhawk', 8, 'epic', '', [17, 25], [addQuickness(8)]));
Weapons.push(new Weapon('Heartsbane', 10, 'legendary', 'A real heartbreaker', [7, 13], [addQuickness(7), quickStrike(100, 5)]));

Armors.push(new Armor('Wool Shirt', 1, 'none', '', 'chest', 2));
Armors.push(new Armor('Twine Cinch', 1, 'none', '','belt', 1));
Armors.push(new Armor('Ragged Trousers', 1, 'none', '','pants', 1));
Armors.push(new Armor('Damp Boots', 1, 'none', '','boots', 1));
Armors.push(new Armor('Linen Shirt', 1, 'common', '','chest', 2, [addQuickness(1)]));
Armors.push(new Armor('Leather Belt', 1, 'common', '','belt', 2));
Armors.push(new Armor('Wool Cap', 1, 'common', '','head', 2));
Armors.push(new Armor('Old Cloak', 1, 'common', '','back', 2));
Armors.push(new Armor('Leather Sandals', 1, 'none', '','boots', 2));

Armors.push(new Armor('Wool Sash', 2, 'none', '','belt', 2));
Armors.push(new Armor('Old Canvas Pants', 2, 'none', '','pants', 2));
Armors.push(new Armor('Skull Cap', 2, 'none', '','head', 2));
Armors.push(new Armor('Thick Wool Shirt', 2, 'common', '','chest', 4));
Armors.push(new Armor('Thick Leather Belt', 2, 'common', '','belt', 3));
Armors.push(new Armor('Leather Hat', 2, 'common', '','head', 3));
Armors.push(new Armor('Wool Cloak', 2, 'common', '','back', 3));
Armors.push(new Armor('Travelers Boots', 2, 'common', '','boots', 3));

Armors.push(new Armor('Centurian Cask', 8, 'epic', '','head', 18));
Armors.push(new Armor('Arturus Tabard', 10, 'legendary', 'This belonged to a true badass.','chest', 50, [addQuicknessAndStrength(10)]));

Consumables.push(new Consumable('Chicken Egg', 1, 'none', '', [healPlayer(4)]));
Consumables.push(new Consumable('Peasant Bread', 1, 'none', '', [healPlayer(5)]));
Consumables.push(new Consumable('Jerky', 1, 'common', '', [healPlayer(6)]));
Consumables.push(new Consumable('Dried Trout', 2, 'none', '', [healPlayer(8)]));
Consumables.push(new Consumable('Sharpsword Oil', 2, 'rare', '', [buffMaxDamage(2)]));
Consumables.push(new Consumable('Whetstone', 2, 'common', '', [buffMinDamage(1)]));


var Items = Weapons.concat(Armors, Consumables);

var QuestItem = function(name, rarity, flavorText, effects) {
	this.name = name;
	this.itemType = 'quest';
	this.rarity = rarity;
	this.flavorText = flavorText;
	this.use = Item.prototype.use;
	this.effect = effects;
};

Items.push(new QuestItem('Message', 'epic', 'The cover says: "To be delivered to Jawn Peteron"', [new QuestEffect('Click to read', 'It reads "There used to be a graying tower alone on the sea." That\'s the opening lyric to Seal\'s "Kiss from a Rose." Curious.')]));

// var weaponTypes = ['Sword', 'Shortsword', 'Longsword', 'Bastardsword', 'Rapier', 'Katana', 'Dirk', 'Gladius', 'Broadsword', 'Fencer', 'Claymore', 'Scimitar', 'Cutlass'];
// var weaponDescriptors = ['Double Edged', 'Damascus', 'Steel', 'Iron', 'Folded', 'Cobalt', 'Fine', 'Serrated', 'Sharp', 'Heavy', 'Weighted', 'Ancient', 'Bloody', 'Blinding'];

// var newSword = function() {
// 	var type = weaponTypes[roll(0,weaponTypes.length)];
// 	var kind = weaponDescriptors[roll(0,weaponDescriptors.length)];
// 	var minDamage = roll(0,100);
// 	var maxDamage = minDamage + roll(0, minDamage);
// 	return new Weapon(''+kind+' '+type+'', 4, 'common', '', minDamage, maxDamage);
// };
