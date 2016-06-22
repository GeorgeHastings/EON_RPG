"use strict";function Enemy(e,n,a,s,t,i){this.name=e,this.level=n,this.healthTotal=a,this.armor=t,this.quicknessProc=i,this.equippedWeapon=s,this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)}var Enemies=[];Enemy.prototype.getBaseDamage=function(){Player.getBaseDamage.call(this)},Enemy.prototype.attack=function(e){Player.attack.call(this,e)},Enemy.prototype.rollQuicknessProc=function(){Player.rollQuicknessProc.call(this)},Enemies.push(new Enemy("Goblin Loan Shark",1,12,"Muddy Hatchet",1,.03)),Enemies.push(new Enemy("Derranged Lunatic",1,12,"Muddy Hatchet",2,.03)),Enemies.push(new Enemy("Highway Bandit",1,15,"Dull Axe",1,.05)),Enemies.push(new Enemy("Wandering Looter",1,15,"Rusty Short Sword",1,.03)),Enemies.push(new Enemy("Goblin Trapper",1,17,"Bent Spear",2,.04)),Enemies.push(new Enemy("Cloaked Assassin",1,17,"Iron Dagger",2,.05)),Enemies.push(new Enemy("Town Guard",2,16,"Bronze Short Sword",5,.03)),Enemies.push(new Enemy("Black Wolf",2,12,"Fang Claws",1,.1)),Enemies.push(new Enemy("Sinclair Black",4,40,"Wind Blade",10,.05)),Enemies.push(new Enemy("Target Dummy",2,1e3,"Fang Claws",1,.1));