'use strict'

var StatBuff = function(amt, stats, description) {
	this.amt = amt;
	this.stats = stats;
	this.description = description;
};

StatBuff.prototype.run = function() {
	for(var i = 0; i < this.stats.length; i++) {
		Player[this.stats[i]] += this.amt;
	}
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
	this.logMessage = 'You are healed for '+this.amt+'';
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

var WeaponBuff = function(amt, stats, description) {
	this.amt = amt;
	this.stats = stats;
	this.description = description;
};

WeaponBuff.prototype = new StatBuff();

WeaponBuff.prototype.run = function() {
	var logMessage;
	if(Player.equippedWeapon) {
		Player.equippedWeapon[this.stats] += this.amt;
		logMessage = 'Your '+Player.equippedWeapon.name+'s max attack is increased by '+this.amt+'';	
	}
	else {
		logMessage = 'You need to equip a weapon to use this';
	}
	UI.combatLog.renderCombatLog(logMessage);
};

var buffMaxDamage = function(amt) {
	return new WeaponBuff(amt, 'damageMax', 'Increase your equipped weapons max damage by '+amt+'');
};

var buffMinDamage = function(amt) {
	return new WeaponBuff(amt, 'damageMin', 'Increase your equipped weapons max damage by '+amt+'');
};