'use strict';

var Items = {
	weapons: [],
	armor: [],
	consumables: [],
	all: []
};

var Pricing = {
	rarities: {
		'none': 0.5,
		'common': 1,
		'rare': 1.5,
		'epic': 2,
		'legendary': 3,
		'set': 3
	},
	types: {
		'weapon': 1,
		'armor': 0.6,
		'consumable': 0.3
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
	return ((this.level*10) * this.getRarityMultiplier().toFixed(1));
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

var buildItems = function() {
	forEach(items, function(enemy){
		Enemies.push(new Enemy(enemy[0], enemy[1]));
	});
};

Items.weapons.push(
	new Weapon('Foam Sword', 0, 'none', 'Just for fun', [0,0]),

	new Weapon('Muddy Hatchet', 1, 'none', '', [1, 3]),
	new Weapon('Rusty Short Sword', 1, 'none', '', [2, 4]),
	new Weapon('Dull Axe', 1, 'none', '', [1, 5]),
	new Weapon('Wooden Staff', 1, 'none', '', [2, 3]),
	new Weapon('Bent Spear', 1, 'none', '', [1, 4]),
	new Weapon('Iron Dagger', 1, 'common', '', [3, 4]),
	new Weapon('Short Spear', 1, 'common', '', [1, 6]),
	new Weapon('Blacksmith Hammer', 1, 'common', '', [2, 5]),
	new Weapon('Bronze Short Sword', 1, 'common', '', [3, 4]),

	new Weapon('Rusty Battle Axe', 2, 'none', '', [1, 6]),
	new Weapon('Oak Club', 2, 'none', '', [2, 5]),
	new Weapon('Old Longsword', 2, 'none', '', [3, 4]),
	new Weapon('Logging Axe', 2, 'none', '', [2, 6]),
	new Weapon('Bronze Spear', 2, 'common', '', [1, 8]),
	new Weapon('Balanced Dagger', 2, 'rare', '', [3, 5], [Effects.buffs.quickness(1)]),
	new Weapon('Fang Claws', 2, 'common', '', [2, 7]),
	new Weapon('Iron Short Sword', 2, 'common', '', [3, 6]),

	new Weapon('Wind Blade', 3, 'rare', '', [4, 9], [Effects.procs.weaponDamage(2, 15)]),
	new Weapon('Double Edged Katana', 10, 'epic', '', [5, 7], [Effects.procs.weaponDamage(5, 10)]),
	new Weapon('Sadams Golden AK-47', 20, 'legendary', 'Complete with incendiary rounds', [77, 133], [Effects.procs.weaponDamage(33, 20)]),
	new Weapon('P-70 Stealthhawk', 8, 'epic', '', [17, 25], [Effects.buffs.quickness(8)]),
	new Weapon('Heartsbane', 10, 'legendary', 'A real heartbreaker', [7, 13], [Effects.buffs.quickness(7), Effects.procs.weaponDamage(100, 5)]),
	new Weapon('Kusanagi the Grass Cutter', 30, 'set', 'Previously known as Sword of the Gathering Clouds of Heaven', [123, 244], [Effects.buffs.toughness(20), Effects.buffs.quickness(35), Effects.procs.weaponDamage(50, 15)])
);

Items.armor.push(
	new Armor('Wool Shirt', 1, 'none', '', 'chest', 2),
	new Armor('Twine Cinch', 1, 'none', '','belt', 1),
	new Armor('Ragged Trousers', 1, 'none', '','pants', 1),
	new Armor('Damp Boots', 1, 'none', '','boots', 1),
	new Armor('Linen Shirt', 1, 'rare', '','chest', 2, [Effects.buffs.quickness(1)]),
	new Armor('Leather Belt', 1, 'common', '','belt', 2),
	new Armor('Wool Cap', 1, 'common', '','head', 2),
	new Armor('Old Cloak', 1, 'common', '','back', 2),
	new Armor('Leather Sandals', 1, 'none', '','boots', 2),

	new Armor('Wool Sash', 2, 'none', '','belt', 2),
	new Armor('Old Canvas Pants', 2, 'none', '','pants', 2),
	new Armor('Skull Cap', 2, 'none', '','head', 2),
	new Armor('Thick Wool Shirt', 2, 'common', '','chest', 4),
	new Armor('Thick Leather Belt', 2, 'common', '','belt', 3),
	new Armor('Leather Hat', 2, 'common', '','head', 3),
	new Armor('Wool Cloak', 2, 'common', '','back', 3),
	new Armor('Travelers Boots', 2, 'common', '','boots', 3),

	new Armor('Centurian Cask', 8, 'epic', '','head', 18, [Effects.buffs.toughness(6), Effects.buffs.quickness(6)]),
	new Armor('Yata no Kagami', 30, 'set', '','back', 90, [Effects.buffs.toughness(40), Effects.procs.mirrorDamage(2, 20)]),
	new Armor('Arturus Tabard', 10, 'legendary', 'This belonged to a true badass.','chest', 50, [Effects.buffs.toughness(10), Effects.buffs.quickness(10)])
);

Items.consumables.push(
	new Consumable('Chicken Egg', 1, 'none', '', [Effects.heals.healPlayer(4)]),
	new Consumable('Peasant Bread', 1, 'none', '', [Effects.heals.healPlayer(5)]),
	new Consumable('Jerky', 1, 'common', '', [Effects.heals.healPlayer(6)]),
	new Consumable('Dried Trout', 2, 'none', '', [Effects.heals.healPlayer(8)]),
	new Consumable('Sharpsword Oil', 2, 'rare', '', [Effects.buffs.weaponDamage(2, 'max')]),
	new Consumable('Whetstone', 2, 'common', '', [Effects.buffs.weaponDamage(1, 'min')])
);

var QuestItem = function(name, rarity, flavorText, effects) {
	this.name = name;
	this.itemType = 'quest';
	this.rarity = rarity;
	this.flavorText = flavorText;
	this.use = Item.prototype.use;
	this.effect = effects;
};

Items.all = Items.weapons.concat(Items.armor, Items.consumables);

Items.all.push(new QuestItem('Message', 'epic', 'The cover says: "To be delivered to Jon Peterson"', [new QuestEffect('Click to read', 'It reads "There used to be a graying tower alone on the sea." That\'s the opening lyric to Seal\'s "Kiss from a Rose." Curious.')]));

// var weaponTypes = ['Sword', 'Shortsword', 'Longsword', 'Bastardsword', 'Rapier', 'Katana', 'Dirk', 'Gladius', 'Broadsword', 'Fencer', 'Claymore', 'Scimitar', 'Cutlass'];
// var weaponDescriptors = ['Double Edged', 'Damascus', 'Steel', 'Iron', 'Folded', 'Cobalt', 'Fine', 'Serrated', 'Sharp', 'Heavy', 'Weighted', 'Ancient', 'Bloody', 'Blinding'];

// var newSword = function() {
// 	var type = weaponTypes[roll(0,weaponTypes.length)];
// 	var kind = weaponDescriptors[roll(0,weaponDescriptors.length)];
// 	var minDamage = roll(0,100);
// 	var maxDamage = minDamage + roll(0, minDamage);
// 	return new Weapon(''+kind+' '+type+'', 4, 'common', '', minDamage, maxDamage);
// };
