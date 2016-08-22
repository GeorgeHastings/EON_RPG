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
	// Player.getBaseDamage.call(this);
	var baseDamage;
	baseDamage = this.equippedWeapon ? roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]) : roll(0,3);
	return baseDamage;
};

Enemy.prototype.attack = function(target) {
	Player.attack.call(this, target);
};

Enemy.prototype.rollQuicknessProc = function() {
	var result = roll(0, 100);
	if (result <= this.quicknessProc) {
		return true;
	} else {
		return false;
	}
};

Enemies.push(new Enemy('Vagrant Ranger', 1, 12, 'Muddy Hatchet', 1, 3));
Enemies.push(new Enemy('Derranged Lunatic', 1, 12, 'Muddy Hatchet', 2, 3));
Enemies.push(new Enemy('Highway Bandit', 1, 15, 'Dull Axe', 1, 0.05));
Enemies.push(new Enemy('Wandering Looter', 1, 15, 'Rusty Short Sword', 1, 3));
Enemies.push(new Enemy('Goblin Trapper', 1, 17, 'Bent Spear', 2, 0.04));
Enemies.push(new Enemy('Cloaked Assassin', 1, 17, 'Iron Dagger', 2, 5));

Enemies.push(new Enemy('Town Guard', 2, 16, 'Bronze Short Sword', 5, 3));
Enemies.push(new Enemy('Black Wolf', 2, 12, 'Fang Claws', 1, 10));

Enemies.push(new Enemy('Sinclair Graves', 4, 40, 'Wind Blade', 10, 5));

Enemies.push(new Enemy('Target Dummy', 2, 1000, 'Foam Sword', 1, 30));

Enemies.push(new Enemy('Volkswain the Unmarred', 10, 300, 'Wind Blade', 20, 15));
