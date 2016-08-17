'use strict'

var StatBuff = function(amt, stats, description) {
	this.amt = amt;
	this.stats = stats;
	this.description = description;
};

var QuestEffect = function(description, content) {
	this.description = description;
	this.content = content;
};

QuestEffect.prototype.run = function() {
	UI.combatLog.renderCombatLog(this.content);
};

// var ReadLetter = new QuestEffect('Click to read', 'Hey there, you can go fuck yourself Jawn.');

StatBuff.prototype.run = function() {
	var amount = this.amt;
	forEach(this.stats, function(stat) {
		Player[stat] += amount;
	});
};

StatBuff.prototype.desc = function() {
	return this.description;
};

StatBuff.prototype.removeBuff = function() {
	for(var i = 0; i < this.stats.length; i++) {
		Player[this.stats[i]] -= this.amt;
	}
};

var Heal = function(amt, stats, description) {
	this.amt = amt;
	this.stats = stats;
	this.description = description;
	this.logMessage = colorize('You', UI.colors.player)+' are '+colorize('healed', '#24fb27')+' for '+colorize(this.amt, '#24fb27')+'';
};

Heal.prototype = new StatBuff();

Heal.prototype.run = function() {
	var lostHealth = Player.healthMax - Player.healthTotal;
	if(this.amt <= lostHealth) {
		Player.healthTotal += this.amt;
	}
	else {
		Player.healthTotal += lostHealth;
	}
	UI.combatLog.renderCombatLog(this.logMessage);
};

var addStrength = function(amt) {
	return new StatBuff(amt, ['strength', 'healthTotal', 'healthMax', 'armor'], 'Strength +'+amt+'');
};

var addQuickness = function(amt) {
	return new StatBuff(amt, ['quickness'], 'Quickness +'+amt+'');
};

var addQuicknessAndStrength = function(amt) {
	return new StatBuff(amt, ['quickness', 'strength'], 'Quickness +'+amt+'<br>Strength +'+amt+'');
};

var healPlayer = function(amt) {
	return new Heal(amt, ['healthTotal'], 'Restore '+amt+' hp');
};

var DamageBuff = function(amt, stats, description) {
	this.amt = amt;
	this.stats = stats;
	this.description = description;
};

DamageBuff.prototype = new StatBuff();

DamageBuff.prototype.run = function() {
	var logMessage;
	if(Player.equippedWeapon) {
		Player.equippedWeapon.damage[this.stats] += this.amt;
		logMessage = 'Your '+colorize(Player.equippedWeapon.name, UI.colors[Player.equippedWeapon.rarity])+'\'s max attack is increased by '+this.amt+'';
	}
	else {
		logMessage = 'You need to equip a weapon to use this';
	}
	UI.combatLog.renderCombatLog(logMessage);
};

var buffMaxDamage = function(amt) {
	return new DamageBuff(amt, 1, 'Increase your equipped weapons max damage by '+amt+'');
};

var buffMinDamage = function(amt) {
	return new DamageBuff(amt, 0, 'Increase your equipped weapons min damage by '+amt+'');
};

var ItemProc = function(amt, chance, description) {
	this.amt = amt;
	this.chance = chance;
	this.description = description;
};

ItemProc.prototype.run = function() {
	var procChance = roll(0,100);
	if(procChance <= this.chance) {
		return true;
	}
};

ItemProc.prototype.desc = function() {
	return this.description;
};

var quickStrike = function(amt, chance) {
	return new ItemProc(amt, chance, ''+chance+'% chance to deal an additional '+amt+' damage')
};
