'use strict';

var Enemies = [];

var Enemy = function(name, level) {
	this.name = name;
	this.level = level;
	this.healthTotal = 10 + ((level - 1) * 4 + 1);
	this.armor = ((level - 1) * 4 + 1);
	this.quicknessProc = 5;
	this.equippedWeapon = getRandomLootByLevel('weapons', level);
	this.damageReduction  = (1 - (0.03*this.armor)/(1 + 0.03*this.armor)).toFixed(2);
};

var CustomEnemy = function(name, level, healthTotal, weapon, armor, quicknessProc) {
	this.name = name;
	this.level = level;
	this.healthTotal = healthTotal;
	this.armor = armor;
	this.quicknessProc = quicknessProc;
	this.equippedWeapon = getObj(Items.weapons, weapon);
	this.damageReduction  = (1 - (0.03*this.armor)/(1 + 0.03*this.armor)).toFixed(2);
};

Enemy.prototype.getBaseDamage = function() {
	return this.equippedWeapon ? roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]) : roll(0,3);
};
CustomEnemy.prototype.getBaseDamage = function() {
	return this.equippedWeapon ? roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]) : roll(0,3);
};

Enemy.prototype.attack = function(target) {
	Player.attack.call(this, target);
};
CustomEnemy.prototype.attack = function(target) {
	Player.attack.call(this, target);
};

Enemy.prototype.rollQuicknessProc = function() {
	return roll(0, 100) <= this.quicknessProc ? true : false;
};
CustomEnemy.prototype.rollQuicknessProc = function() {
	return roll(0, 100) <= this.quicknessProc ? true : false;
};

var enemies = [
	['Vagrant Ranger', 1],
	['Gray Wolf', 1],
	['Derranged Lunatic', 1],
	['Highway Bandit', 1],
	['Wandering Looter', 1],
	['Cloaked Assassin', 1],
	['Town Guard', 2],
	['Black Wolf', 2],
];

var customEnemies = [
	['Sinclair Graves', 4, 40, 'Wind Blade', 10, 5],
	['Target Dummy', 2, 1000, 'Foam Sword', 1, 0],
	['Volkswain the Unmarred', 10, 400, 'Wind Blade', 20, 15]
];

var buildNormalEnemy = function(name, level){
	return new Enemy(name, level);
};
var buildCustomEnemy = function(name, level, healthTotal, weapon, armor, quicknessProc){
	return new CustomEnemy(name, level, healthTotal, weapon, armor, quicknessProc);
};

var buildEnemies = function() {
	var allEnemies = enemies.concat(customEnemies);
	forEach(allEnemies, function(enemy) {
		if(enemy.length > 2) {
			Enemies.push(buildCustomEnemy.apply(null, enemy));
		}
		else {
			Enemies.push(buildNormalEnemy.apply(null, enemy));
		}
	});
};

buildEnemies();

// Enemies.push(new Enemy('Vagrant Ranger', 1));
// Enemies.push(new Enemy('Derranged Lunatic', 1));
// Enemies.push(new Enemy('Highway Bandit', 1));
// Enemies.push(new Enemy('Wandering Looter', 1));
// Enemies.push(new Enemy('Goblin Trapper', 1));
// Enemies.push(new Enemy('Cloaked Assassin', 1));
//
// Enemies.push(new Enemy('Town Guard', 2));
// Enemies.push(new Enemy('Black Wolf', 2));
//
// Enemies.push(new CustomEnemy('Sinclair Graves', 4, 40, 'Wind Blade', 10, 5));
// Enemies.push(new CustomEnemy('Target Dummy', 2, 1000, 'Foam Sword', 1, 0));
// Enemies.push(new CustomEnemy('Volkswain the Unmarred', 10, 400, 'Heartsbane', 20, 15));
