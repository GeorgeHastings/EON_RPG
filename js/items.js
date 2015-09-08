'use strict';

var Weapons = [];
var Armors = [];
var Consumables = [];

function Item(name, level, rarity, flavorText) {
	this.name = name;
	this.level = level;
	this.rarity = rarity;
	this.flavorText = flavorText;
}

Item.prototype.use = function() {
	if(this.hasOwnProperty('effect')) {
		this.effect.run(this.effectAmt);
		Player.updateStats();
	}
};

Item.prototype.removeEquipBuff = function() {
	if(this.hasOwnProperty('effect')) {
		this.effect.run(-this.effectAmt);
	}
};

Item.prototype.desc = function() {
	return this.effect.desc(this.effectAmt);
};

Item.effects = {
	addStrength: {
		run: function(amt) {
			Player.strength += amt;
			Player.healthTotal += amt;
			Player.healthMax += amt;
			Player.armor += amt;
		},
		desc: function(amt) {
			return 'Strength +'+amt+'';
		}
	},
	addQuickness: {
		run: function(amt) {
			Player.quickness += amt; 
		},
		desc: function(amt) {
			return 'Quickness +'+amt+'';
		}
	},
	buffMaxDamage: {
		run: function(amt) {
			var logMessage = 'Your '+Player.equippedWeapon.name+'s max attack is increased by '+amt+'';
			Player.equippedWeapon.damageMax += amt;
			UI.combatLog.renderCombatLog(logMessage);
		},
		desc: function(amt) {
			return 'Increase your equipped weapons max damage by '+amt+'';
		}
	},
	healPlayer: {
		run: function(amt) {
			var logMessage = 'You are healed for '+amt+'';
			var lostHealth = Player.healthMax - Player.healthTotal;
			if(amt <= lostHealth) {
				Player.healthTotal += amt;	
			}
			else {
				Player.healthTotal += lostHealth;
			}
			UI.combatLog.renderCombatLog(logMessage);
		},
		desc: function(amt) {
			return 'Restore '+amt+' hp';
		}
	}
};

var Weapon = function(name, level, rarity, flavorText, damageMin, damageMax, effect, effectAmt){
	var weapon = new Item(name,level, rarity, flavorText);
	weapon.damageMin = damageMin;
	weapon.damageMax = damageMax;
	weapon.itemType = 'weapon';
	if(effect && effectAmt) {
		weapon.effect = Item.effects[effect];
		weapon.effectAmt = effectAmt;
	}
	return weapon;
};

var Armor = function(name, level, rarity, flavorText, armorAmt, effect, effectAmt) {
	var armor = new Item(name,level, rarity, flavorText);
	armor.armorAmt = armorAmt;
	armor.itemType = 'armor';
	if(effect && effectAmt) {
		armor.effect = Item.effects[effect];
		armor.effectAmt = effectAmt;
	}
	return armor;
};

var Consumable = function(name, level, rarity, flavorText, effect, effectAmt){
	var consumable = new Item(name,level, rarity, flavorText);
	consumable.effect = Item.effects[effect];
	consumable.effectAmt = effectAmt;
	consumable.itemType = 'consumable';
	return consumable;
};

Weapons.push(new Weapon('Muddy Hatchet', 1, 'none', 'Better than nothing', 1, 3));
Weapons.push(new Weapon('Rusty Short Sword', 1, 'none', 'May give your enemy Tetnis.', 2, 4));
Weapons.push(new Weapon('Dull Axe', 1, 'none', 'Chopped a lot of trees.', 1, 5));
Weapons.push(new Weapon('Wooden Staff', 1, 'none', '', 2, 3));
Weapons.push(new Weapon('Bent Spear', 1, 'none', 'Good for stabbing around corners.', 1, 4));
Weapons.push(new Weapon('Iron Dagger', 1, 'common', 'Its made of iron.', 3, 4, 'addStrength', 1));
Weapons.push(new Weapon('Short Spear', 1, 'common', 'Short but pointy.', 1, 6));
Weapons.push(new Weapon('Blacksmith Hammer', 1, 'common', 'Could probably make a better weapon.', 2, 5));
Weapons.push(new Weapon('Bronze Short Sword', 1, 'common', 'A sword with a tan.', 3, 4));

Weapons.push(new Weapon('Rusty Battle Axe', 2, 'none', '', 1, 6));
Weapons.push(new Weapon('Oak Club', 2, 'none', '', 2, 5));
Weapons.push(new Weapon('Old Longsword', 2, 'none', '', 3, 4));
Weapons.push(new Weapon('Logging Axe', 2, 'none', '', 2, 6));
Weapons.push(new Weapon('Bronze Spear', 2, 'common', '', 1, 8));
Weapons.push(new Weapon('Oily Dagger', 2, 'common', '', 3, 5, 'addQuickness', 1));
Weapons.push(new Weapon('Fang Claws', 2, 'common', '', 2, 7));
Weapons.push(new Weapon('Iron Short Sword', 2, 'common', '', 3, 6));

Armors.push(new Armor('Wool Shirt', 1, 'none', 'Bahh', 2));
Armors.push(new Armor('Twine Cinch', 1, 'none', 'Doesnt look cool.', 1));
Armors.push(new Armor('Ragged Trousers', 1, 'none', 'Good for an Oliver Twist constume.', 1));
Armors.push(new Armor('Damp Boots', 1, 'none', 'Squish squish.', 1));
Armors.push(new Armor('Linen Shirt', 1, 'common', 'Great for the summer.', 2, 'addQuickness', 1));
Armors.push(new Armor('Leather Belt', 1, 'common', 'Just like your Dads.', 2));
Armors.push(new Armor('Wool Cap', 1, 'common', 'Wear it backwards.', 2));
Armors.push(new Armor('Wool Cloak', 1, 'common', 'No cloak joke.', 2));

Consumables.push(new Consumable('Chicken Egg', 1, 'common', 'Scrambled', 'healPlayer', 4));
Consumables.push(new Consumable('Jerky', 1, 'common', 'Honey BBQ', 'healPlayer', 6));
Consumables.push(new Consumable('Sharpsword Oil', 3, 'rare', 'Stay sharp', 'buffMaxDamage', 2));



var Items = Weapons.concat(Armors, Consumables);

Items.push(new Item('Message', 1, 'epic', 'It reads: "To be delivered to Jawn Peteron"'));