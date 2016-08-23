'use strict';

var Effects = {
	buffs: {
		statBuff: function(amt, stats, description) {
			this.amt = amt;
			this.stats = stats;
			this.description = description;
		},
		toughness: function(amt) {
			return new Effects.buffs.statBuff(amt, ['toughness', 'healthTotal', 'healthMax', 'armor'], 'Toughness +'+amt+'');
		},
		quickness: function(amt) {
			return new Effects.buffs.statBuff(amt, ['quickness'], 'Quickness +'+amt+'');
		},
		weaponDamage: function(amt, minMax) {
			var type = minMax === 'min' ? 0 : 1;
			var effect = new Effects.buffs.statBuff(amt, type, 'Increase your equipped weapons\'s '+minMax+' damage by '+amt+'');
			effect.run = function() {
				var logMessage;
				if(Player.equippedWeapon) {
					Player.equippedWeapon.damage[type] += this.amt;
					logMessage = 'Your '+colorize(Player.equippedWeapon.name, UI.colors[Player.equippedWeapon.rarity])+'\'s max attack is increased by '+amt+'';
				}
				else {
					logMessage = 'You need to equip a weapon to use this';
				}
				UI.combatLog.renderCombatLog(logMessage);
			};
			return effect;
		}
	},
	debuffs: {

	},
	heals: {
		heal: function(amt) {
			this.amt = amt;
			this.description = 'Restore '+amt+' hp';
			this.logMessage = colorize('You', UI.colors.player)+' are '+colorize('healed', UI.colors.green)+' for '+colorize(amt, UI.colors.green)+'';
		},
		healPlayer: function(amt) {
			return new Effects.heals.heal(amt);
		}
	},
	quest: {

	},
	procs: {
		itemProc: function(amt, chance, description) {
			this.amt = amt;
			this.chance = chance;
			this.description = description;
		},
		weaponDamage: function(amt, chance) {
			var wd = new Effects.procs.itemProc(amt, chance, chance + '% chance to deal '+amt+' damage');
			wd.run = function() {
				var procChance = roll(0,100);
				if(procChance <= chance) {
					return true;
				}
			};
			return wd;
		},
		mirrorDamage: function(amt, chance) {
			var e = new Effects.procs.itemProc(amt, chance, chance + '% chance to reflect damage');
			e.run = function() {
				var procChance = roll(0,100);
				if(procChance <= chance) {
					return true;
				}
			};
			return e;
		}
	}
};

Effects.buffs.statBuff.prototype.run = function() {
	var amount = this.amt;
	forEach(this.stats, function(stat) {
		Player[stat] += amount;
	});
};

Effects.buffs.statBuff.prototype.remove = function() {
	for(var i = 0; i < this.stats.length; i++) {
		Player[this.stats[i]] -= this.amt;
	}
};

Effects.heals.heal.prototype.run = function() {
	var lostHealth = Player.healthMax - Player.healthTotal;
	if(this.amt <= lostHealth) {
		Player.healthTotal += this.amt;
	}
	else {
		Player.healthTotal += lostHealth;
	}
	UI.combatLog.renderCombatLog(this.logMessage);
};

var QuestEffect = function(description, content) {
	this.description = description;
	this.content = content;
};

QuestEffect.prototype.run = function() {
	UI.combatLog.renderCombatLog(this.content);
};
