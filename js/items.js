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

Item.prototype.getRarityMultiplier = function() {
	if(this.rarity === 'none') {
		return 0.5;
	}
	if(this.rarity === 'common') {
		return 1;
	}
	if(this.rarity === 'rare') {
		return 1.5;
	}
	if(this.rarity === 'legendary') {
		return 2;
	}
};

Item.prototype.getSalePrice = function() {
	return (this.level*10) * this.getRarityMultiplier();
};

Item.prototype.getPurchasePrice = function() {
	return (this.level*10) * this.getRarityMultiplier() + (this.level*10);
};

var Effect = function(amt, runEffects, description) {
	this.amt = amt;
	this.runEffects = runEffects;
	this.description = description;
};

Effect.prototype.run = function() {
	for(var i = 0; i < this.runEffects.length; i++) {
		Player[this.runEffects[i]] += this.amt;
	}
};

Effect.prototype.desc = function() {
	return this.description + ' +' + this.amt;
};

var addStrength = new Effect(2, ['strength', 'healthTotal', 'healthMax', 'armor'], 'Strength'); 

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
			var logMessage;

			if(Player.equippedWeapon) {
				Player.equippedWeapon.damageMax += amt;
				logMessage = 'Your '+Player.equippedWeapon.name+'s max attack is increased by '+amt+'';	
			}
			else {
				logMessage = 'You need to equip a weapon to use this';
			}

			UI.combatLog.renderCombatLog(logMessage);
		},
		desc: function(amt) {
			return 'Increase your equipped weapons max damage by '+amt+'';
		}
	},
	buffMinDamage: {
		run: function(amt) {
			var logMessage;

			if(Player.equippedWeapon) {
				Player.equippedWeapon.damageMin += amt;
				logMessage = 'Your '+Player.equippedWeapon.name+'s min attack is increased by '+amt+'';	
			}
			else {
				logMessage = 'You need to equip a weapon to use this';
			}

			UI.combatLog.renderCombatLog(logMessage);
		},
		desc: function(amt) {
			return 'Increase your equipped weapons min damage by '+amt+'';
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

Weapons.push(new Weapon('Muddy Hatchet', 1, 'none', '', 1, 3));
Weapons.push(new Weapon('Rusty Short Sword', 1, 'none', '', 2, 4));
Weapons.push(new Weapon('Dull Axe', 1, 'none', '', 1, 5));
Weapons.push(new Weapon('Wooden Staff', 1, 'none', '', 2, 3));
Weapons.push(new Weapon('Bent Spear', 1, 'none', '', 1, 4));
Weapons.push(new Weapon('Iron Dagger', 1, 'common', '', 3, 4, 'addStrength', 1));
Weapons.push(new Weapon('Short Spear', 1, 'common', '', 1, 6));
Weapons.push(new Weapon('Blacksmith Hammer', 1, 'common', '', 2, 5));
Weapons.push(new Weapon('Bronze Short Sword', 1, 'common', '', 3, 4));

Weapons.push(new Weapon('Rusty Battle Axe', 2, 'none', '', 1, 6));
Weapons.push(new Weapon('Oak Club', 2, 'none', '', 2, 5));
Weapons.push(new Weapon('Old Longsword', 2, 'none', '', 3, 4));
Weapons.push(new Weapon('Logging Axe', 2, 'none', '', 2, 6));
Weapons.push(new Weapon('Bronze Spear', 2, 'common', '', 1, 8));
Weapons.push(new Weapon('Oily Dagger', 2, 'common', '', 3, 5, 'addQuickness', 1));
Weapons.push(new Weapon('Fang Claws', 2, 'common', '', 2, 7));
Weapons.push(new Weapon('Iron Short Sword', 2, 'common', '', 3, 6));

Weapons.push(new Weapon('Sword of Saladin', 15, 'legendary', '', 30, 60, 'addQuickness', 20));

Armors.push(new Armor('Wool Shirt', 1, 'none', '', 2));
Armors.push(new Armor('Twine Cinch', 1, 'none', '', 1));
Armors.push(new Armor('Ragged Trousers', 1, 'none', '', 1));
Armors.push(new Armor('Damp Boots', 1, 'none', '', 1));
Armors.push(new Armor('Linen Shirt', 1, 'common', '', 2, 'addQuickness', 1));
Armors.push(new Armor('Leather Belt', 1, 'common', '', 2));
Armors.push(new Armor('Wool Cap', 1, 'common', '', 2));
Armors.push(new Armor('Wool Cloak', 1, 'common', '', 2));

Consumables.push(new Consumable('Chicken Egg', 1, 'none', '', 'healPlayer', 4));
Consumables.push(new Consumable('Peasant Bread', 1, 'none', '', 'healPlayer', 5));
Consumables.push(new Consumable('Jerky', 1, 'common', '', 'healPlayer', 6));
Consumables.push(new Consumable('Dried Trout', 2, 'none', '', 'healPlayer', 8));
Consumables.push(new Consumable('Sharpsword Oil', 2, 'rare', '', 'buffMaxDamage', 2));
Consumables.push(new Consumable('Whetstone', 2, 'common', '', 'buffMinDamage', 1));



var Items = Weapons.concat(Armors, Consumables);

Items.push(new Item('Message', 1, 'epic', 'It reads: "To be delivered to Jawn Peteron"'));