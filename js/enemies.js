'use strict';

var Enemies = [];

function Enemy(name, level, healthTotal, weapon, armor, quicknessProc) {
	this.name = name;
	this.level = level;
	this.healthTotal = healthTotal;
	this.armor = armor;
	this.quicknessProc = quicknessProc;
	this.equippedWeapon = weapon;
	this.damageReduction  = (1 - (0.03*this.armor)/(1 + 0.03*this.armor)).toFixed(2);
}

Enemy.prototype.getBaseDamage = function() {
	Player.getBaseDamage.call(this);
};

Enemy.prototype.attack = function(target) {
	Player.attack.call(this, target);
};

Enemy.prototype.rollQuicknessProc = function() {
	Player.rollQuicknessProc.call(this);
};

Enemies.push(new Enemy('Goblin Loan Shark', 1, 12, 'Muddy Hatchet', 1, 0.03));
Enemies.push(new Enemy('Derranged Lunatic', 1, 12, 'Muddy Hatchet', 2, 0.03));
Enemies.push(new Enemy('Highway Bandit', 1, 15, 'Dull Axe', 1, 0.05));
Enemies.push(new Enemy('Wandering Looter', 1, 15, 'Rusty Short Sword', 1, 0.03));
Enemies.push(new Enemy('Goblin Trapper', 1, 17, 'Bent Spear', 2, 0.04));

Enemies.push(new Enemy('Town Guard', 2, 16, 'Bronze Short Sword', 5, 0.03));
Enemies.push(new Enemy('Black Wolf', 2, 12, 'Fang Claws', 1, 0.10));

Enemies.push(new Enemy('Target Dummy', 2, 100000000000000, 'Fang Claws', 1, 0.10));