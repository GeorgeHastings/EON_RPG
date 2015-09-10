'use strict';

var GameState = {
	currentMoment: '',

	setCurrentMoment: function(moment) {
		this.currentMoment = moment;
		UI.narrative.renderMoment();
		this.checkForAndCreateChoices();
		this.checkForAndPickUpLoot();
		this.checkForAndRunCombat();
		this.checkForAndOpenUpShop();
		UI.scrollToBottom(UI.narrative.el);
	},

	checkForFoundLoot: function() {
		return this.currentMoment.hasOwnProperty('dropLoot') && !this.currentMoment.hasOwnProperty('enemy');
	},

	checkForAndPickUpLoot: function() {
		if (this.checkForFoundLoot()) {
			Player.pickUpLoot();	
		}
	},

	checkForAndRunCombat: function() {
		if(this.currentMoment.hasOwnProperty('enemy')) {
			runCombat();
		}
	},

	checkForAndOpenUpShop: function() {
		if(this.currentMoment.hasOwnProperty('shop')) {
			UI.narrative.renderShop();
			this.bindShopItemEvents();
		}
		else {
			this.bindWorldItemEvents();
		}
	},

	checkForAndCreateChoices: function() {
		if(this.currentMoment.hasOwnProperty('choices')) {
			UI.narrative.renderChoices();
		}
	},

	bindWorldItemEvents: function() {
		var intventoryItems = UI.inventory.el.querySelectorAll('[data-item]');
		for(var i = 0; i < intventoryItems.length; i++) {
			intventoryItems[i].onclick = UI.inventory.activateItem;
		}
	},

	bindShopItemEvents: function() {
		var shopItems = UI.narrative.el.querySelectorAll('[data-item]');
		var inventoryItems = UI.inventory.el.querySelectorAll('[data-item]');
		for(var i = 0; i < shopItems.length; i++) {
			shopItems[i].onclick = Player.purchaseItem;
		}
		for(var j = 0; j < inventoryItems.length; j++) {
			inventoryItems[j].onclick = Player.sellItem;
		}
	}
};

var Player = {
	name: 'You',
	healthMax: 25,
	healthTotal: 25,
	armor: 0,
	strength: 0,
	quickness: 1,
	equippedWeapon: '',
	equippedArmor: '',
	inventory: [],
	gold: 0,

	updateStats: function() {
		this.setHealth();
		this.setDamage();
		this.setArmor();
		this.setDamageReduction();
		this.setQuicknessProc();
		UI.statlist.renderStats();
	},

	updateGold: function(amt) {
		this.gold += amt;
		UI.inventory.renderGold();
	},

	setHealth: function(){
		this.health = ''+this.healthTotal+'/'+this.healthMax+'';
	},

	setArmor: function() {
		if(this.equippedArmor) {
			this.armor = this.equippedArmor.armorAmt + this.strength;
		}
	},

	setDamage: function() {
		if(this.equippedWeapon) {
			this.damage = ''+this.equippedWeapon.damageMin+'-'+this.equippedWeapon.damageMax+'';
		}
		else {
			this.damage = '0-2';
		}
	},

	setDamageReduction: function() {
		this.damageReduction = (1 - (0.03*this.armor)/(1 + 0.03*this.armor)).toFixed(2);
	},

	setStrength: function() {
		this.healthTotal = this.healthTotal + this.strength;
		this.healthMax = this.healthMax + this.strength;
	},

	setQuicknessProc: function() {
		this.quicknessProc = ((0.02 * this.quickness) / ((1 + 0.02 * this.quickness)) * 100).toFixed(2);
	},

	getBaseDamage: function(){
		var baseDamage;
		if(this.equippedWeapon) {	
			baseDamage = roll(this.equippedWeapon.damageMin, this.equippedWeapon.damageMax);
		}
		else {
			baseDamage = roll(0,3);
		}
		this.baseDamage = baseDamage;
	},

	rollQuicknessProc: function(){
		var result = roll(0,100);
		if(result <= this.quicknessProc) {
			return true;
		}
		else {
			return false;
		}
	},

	attack: function(target) {
		this.getBaseDamage();
		var damageDealt = (this.baseDamage * target.damageReduction).toFixed(0);
		var hitType = 'hit';
		if(this.rollQuicknessProc()) {
			damageDealt = damageDealt*2;
			hitType = 'critically hit';
		}
		if(target.rollQuicknessProc()) {
			UI.combatLog.renderCombatLog('('+target.healthTotal+') '+target.name+' dodged '+this.name+' for 0');
		}
		else {
			target.healthTotal -= damageDealt;
			UI.combatLog.renderCombatLog('('+this.healthTotal+') '+this.name+' '+hitType+' '+target.name+' for '+damageDealt+'');
		}
	},

	pickUpGold: function() {
		var enemy = getObj(Enemies, GameState.currentMoment.enemy).level;
		var gold = roll(3, 5)*enemy;
		Player.updateGold(gold);
	},

	pickUpLoot: function() {
		for (var i = 0; i < GameState.currentMoment.dropLoot.length; i++) {
			var loot = GameState.currentMoment.dropLoot[i];
			this.addToInventory(loot);
		}
		
		UI.combatLog.renderLootMessage();
	},

	addToInventory: function(itemId) {
		var thisItem = getObj(Items, itemId);
		this.inventory.push(thisItem);
		UI.inventory.renderInventory();
	},

	removeFromInventory: function(itemId) {
		var thisItem = getObj(Items, itemId);
		var index = this.inventory.indexOf(thisItem);
		if (index > -1) {
		    this.inventory.splice(index, 1);
		}
	},

	equipWeapon: function(thisItemId) {
		this.unequipCurrentWeapon();
		this.equippedWeapon = getObj(Weapons, thisItemId);
		Player.updateStats();
	},

	equipArmor: function(thisItemId) {
		this.unequipCurrentArmor();
		this.equippedArmor = getObj(Armors, thisItemId);
		Player.updateStats();
	},

	unequipCurrentWeapon: function(){
		if(this.equippedWeapon) {
			this.equippedWeapon.removeEquipBuff();
		}
	},

	unequipCurrentArmor: function(){
		if(this.equippedArmor) {
			this.armor -= this.equippedArmor.armorAmt;
		}
	},

	purchaseItem: function() {
		var itemId = this.getAttribute('data-item');
		var item = getObj(Items, itemId);
		if(Player.gold >= item.getPurchasePrice()) {
			Player.updateGold(-item.getPurchasePrice());
			Player.addToInventory(itemId);
			UI.inventory.renderInventory();
			UI.combatLog.renderItemTransaction(item.name, item.getPurchasePrice(), 'bought');
		}
		else {
			UI.combatLog.renderCannotPurchaseMessage(item.name, item.getPurchasePrice());
		}	
	},

	sellItem: function() {
		var itemId = this.getAttribute('data-item');
		var item = getObj(Items, itemId);
		Player.updateGold(item.getSalePrice());
		Player.removeFromInventory(itemId);
		UI.inventory.renderInventory();
		UI.combatLog.renderItemTransaction(item.name, item.getSalePrice(), 'sold');
	}
};

var UI = {
	items: document.querySelectorAll('[data-item]'),
	colors: {
		none: '#999',
		common: '#fff',
		rare: '#4D75CE',
		epic: '#9E65C4',
		legendary: '#C6AF66'
	},

	narrative: {
		el: document.getElementById('narrative'),

		getMomentByClick: function() {
			var num = this.getAttribute('data-moment');
			GameState.setCurrentMoment(window['moment'+num]);
		},

		renderShop: function() {
			var shopList = GameState.currentMoment.shop;
			var inventoryItems = UI.inventory.el.querySelectorAll('[data-item]');

			for(var i = 0; i < shopList.length; i++) {
				var item = getObj(Items, shopList[i]);
				var itemEl = document.createElement('a');
				var itemText = document.createTextNode(item.name);
				itemEl.setAttribute('data-item', item.name);
				itemEl.appendChild(itemText);
				UI.narrative.el.appendChild(itemEl);
				itemEl.onclick = Player.purchaseItem;
			}

			for(var j = 0; j < inventoryItems.length; j++) {
				inventoryItems[j].onclick = Player.sellItem;
			}

			UI.items = document.querySelectorAll('[data-item]');
			UI.itemDescription.bindItemDescriptionEvents();
		},

		renderChoices: function() {
			var choices = GameState.currentMoment.choices;
			for (var i = 0; i < choices.length; i++) {
				var choice = choices[i];
				var choiceEl = document.createElement('a');
				var choiceText = document.createTextNode(choice.message);
				choiceEl.setAttribute('data-moment', choice.link);
				choiceEl.appendChild(choiceText);
				UI.narrative.el.appendChild(choiceEl);
				choiceEl.onclick = this.getMomentByClick;
			}
		},

		renderMoment: function() {
			var messageWrapper = document.createElement('p');
			var messageText = document.createTextNode(GameState.currentMoment.message);
			messageWrapper.appendChild(messageText);
			UI.narrative.el.appendChild(messageWrapper);
		}
	},

	statlist: {
		el: document.getElementById('stat-list'),

		renderStats: function() {
			var stats = this.el.querySelectorAll('dd');
			for(var i = 0; i < stats.length; i++) {
				var thisStat = stats[i].getAttribute('data-stat');
				stats[i].innerHTML = Player[thisStat];
			}
		}
	},

	inventory: {
		el: document.getElementById('inventory'),
		gold: document.getElementById('gold'),

		renderInventory: function() {
			this.el.innerHTML = '';
			for(var i = 0; i < Player.inventory.length; i++) {
				var thisItem = Player.inventory[i];
				var itemWrapper = document.createElement('li');
				var itemText = document.createTextNode(thisItem.name);
				itemWrapper.appendChild(itemText);
				this.el.appendChild(itemWrapper);
				itemWrapper.setAttribute('data-item', thisItem.name);

				if(GameState.currentMoment.hasOwnProperty('shop')) {
					GameState.bindShopItemEvents();
				}
				else {
					console.log('bound world item events');
					GameState.bindWorldItemEvents();	
				}

				if(thisItem === Player.equippedWeapon) {
					this.renderEquippedWeapon(itemWrapper);
				}
				if(thisItem === Player.equippedArmor) {
					this.renderEquippedArmor(itemWrapper);
				}
			}
			UI.items = document.querySelectorAll('[data-item]');
			UI.itemDescription.bindItemDescriptionEvents();
		},

		renderGold: function() {
			UI.inventory.gold.innerHTML = Player.gold;
		},

		removeEquippedWepTag: function() {
			var currentWep = document.querySelector('.equipped-wep');
			if(currentWep) {
				currentWep.setAttribute('class', '');
			}
		},

		removeEquippedArmorTag: function() {
			var allArmors = document.querySelectorAll('.equipped-armor');
			for(var i = 0; i < allArmors.length; i++) {
				allArmors[i].setAttribute('class', '');
			}
		},

		activateItem: function() {
			var thisItemId = this.getAttribute('data-item');
			var item = getObj(Items, thisItemId);
			console.log('activating item');

			if(item.itemType === 'weapon' && Player.equippedWeapon !== item) {
				Player.equipWeapon(thisItemId);
				UI.inventory.renderEquippedWeapon(this);
				item.use();
			}
			if(item.itemType === 'armor' && Player.equippedArmor !== item){
				Player.equipArmor(thisItemId);
				UI.inventory.renderEquippedArmor(this);
				item.use();
			}
			if(item.itemType === 'consumable') {
				Player.removeFromInventory(thisItemId);
				UI.itemDescription.hideItemDescription();
				UI.inventory.renderInventory();
				item.use();
			}	
		},

		renderEquippedWeapon: function(thisItem) {
			this.removeEquippedWepTag();
			thisItem.setAttribute('class', 'equipped-wep');
		},

		renderEquippedArmor: function(thisItem) {
			this.removeEquippedArmorTag();
			thisItem.setAttribute('class', 'equipped-armor');
		}
	},

	itemDescription: {
		el: document.getElementById('itemDescription'),
		components: {
			displayName: document.getElementById('displayName'),
			itemAttack: document.getElementById('itemAttack'),
			itemArmor: document.getElementById('itemArmor'),
			itemEffect: document.getElementById('itemEffect'),
			flavorText: document.getElementById('flavorText'),
			salePrice: document.getElementById('salePrice')
		},

		getItemDescriptionY: function(event) {
			var yPos = event.pageY;
			return ''+yPos+'px';

		},

		getItemDescriptionX: function(event) {
			var xPos = event.pageX;
			return ''+xPos+'px';
		},

		positionItemDescription: function(event) {
			UI.itemDescription.el.style.top = UI.itemDescription.getItemDescriptionY(event);
			UI.itemDescription.el.style.left = UI.itemDescription.getItemDescriptionX(event);
		},

		showItemDescription: function() {
			UI.itemDescription.el.style.display = 'block';
		},

		hideItemDescription: function() {
			UI.itemDescription.el.style.display = 'none';
			UI.itemDescription.components.itemAttack.innerHTML = '';
			UI.itemDescription.components.itemEffect.innerHTML = '';
		},

		renderItemDescription: function() {
			var thisItemId = this.getAttribute('data-item');
			var item = getObj(Items, thisItemId);
			UI.itemDescription.components.displayName.innerHTML = item.name;
			UI.itemDescription.components.displayName.style.color = UI.colors[item.rarity];
			UI.itemDescription.components.flavorText.innerHTML = item.flavorText;

			if(item.itemType === 'weapon') {
				UI.itemDescription.components.itemAttack.innerHTML = 'Damage: '+item.damageMin+'-'+item.damageMax+'';
			}
			if(item.itemType === 'armor') {
				UI.itemDescription.components.itemAttack.innerHTML = 'Armor: '+item.armorAmt+'';
			}
			if(item.effect) {
				UI.itemDescription.components.itemEffect.innerHTML = item.desc();
			}
			if(UI.inventory.el.querySelector('[data-item="'+thisItemId+'"]')) {
				UI.itemDescription.components.salePrice.innerHTML = ''+item.getSalePrice()+'';
			}
			else if(UI.narrative.el.querySelector('[data-item="'+thisItemId+'"]')) {
				UI.itemDescription.components.salePrice.innerHTML = ''+item.getPurchasePrice()+'';
			}
			else {
				UI.itemDescription.components.salePrice.innerHTML = '';
			}
			UI.itemDescription.showItemDescription();
		},

		getStatDescriptions: {
			health: function(){return 'If you run out, you die.';},
			armor: function(){return 'Reduces damage taken to '+(Player.damageReduction*100).toFixed(2)+'%';},
			quickness: function(){return''+Player.quicknessProc+'% chance to critical hit and dodge';},
			damage: function(){
				var avg = (Player.equippedWeapon.damageMax + Player.equippedWeapon.damageMin)/2;
				var weightedAvg = (avg + (Player.quicknessProc/100*avg)).toFixed(2);
				return 'Average damage is '+weightedAvg+'';
			},
			strength: function(){return 'Increases armor and max health by '+Player.strength+'';}
		},

		renderStatDescription: function() {
			var thisStatId = this.getAttribute('data-stat');
			UI.itemDescription.components.displayName.innerHTML = thisStatId;
			UI.itemDescription.components.displayName.style.color = 'white';
			UI.itemDescription.components.itemAttack.innerHTML = '';
			UI.itemDescription.components.salePrice.innerHTML = '';
			UI.itemDescription.components.flavorText.innerHTML = UI.itemDescription.getStatDescriptions[thisStatId]();
			UI.itemDescription.showItemDescription();
		},

		bindItemDescriptionEvents: function() {
			var itemList = document.querySelectorAll('[data-item]');
			var statList = document.querySelectorAll('[data-stat]');
			
			for (var i = 0; i < itemList.length; i++) {
				itemList[i].onmouseenter = this.renderItemDescription;
				itemList[i].onmousemove = this.positionItemDescription;
				itemList[i].onmouseleave = this.hideItemDescription;
			}
			for (var j = 0; j < statList.length; j++) {
				statList[j].onmouseenter = this.renderStatDescription;
				statList[j].onmousemove = this.positionItemDescription;
				statList[j].onmouseleave = this.hideItemDescription;
			}
		}
	},

	combatLog: {
		el: document.getElementById('combatLog'),

		renderCombatLog: function(logitem) {
			var logitemWrapper = document.createElement('p');
			var logText = document.createTextNode(logitem);
			logitemWrapper.appendChild(logText);
			this.el.appendChild(logitemWrapper);
			UI.scrollToBottom(UI.combatLog.el);
		},

		renderItemTransaction: function(name, price, transaction) {
			this.renderCombatLog('You '+transaction+' '+name+' for '+price+' gold.');
		},

		renderCannotPurchaseMessage: function(name, price) {
			this.renderCombatLog('You need '+(price - Player.gold)+' gold to buy '+name+'.');
		},

		renderLootMessage: function() {
			var moment = GameState.currentMoment;
			if (moment.enemy){
				if(moment.dropLoot.length > 0) {
					var loot = moment.dropLoot;
					this.renderCombatLog('You defeated the '+moment.enemy+' and found '+loot+'.');
				}
				else {
					this.renderCombatLog('You defeated the '+moment.enemy+'.');
				}
			}
			else {
				this.renderCombatLog('You found '+moment.dropLoot+'');
			}
		},
	},

	scrollToBottom: function(pane) {
		pane.scrollTop = pane.scrollHeight;
	}
};

var roll = function (min, max) {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
};


var getObj = function(arr, val) {
	var result = arr.filter(function(o){
		return o.name === val;
	});
	return result? result[0] : null;
};

var getObjLvl = function(arr, val) {
	var result = [];
  	for(var i = 0; i < arr.length; i++) {
  		if(arr[i].level === val) {
  			result.push(arr[i]);
  		}
  	}
  	return result;
};

var getRandomLootByLevel = function(type, level) {
	var itemsOfLevel = getObjLvl(type, level);
	return itemsOfLevel[roll(0, itemsOfLevel.length - 1)].name;
};

var runCombat = function(){
	var enemyType = getObj(Enemies, GameState.currentMoment.enemy);
	var enemy = new Enemy(enemyType.name, enemyType.level, enemyType.healthTotal, getObj(Items, enemyType.equippedWeapon), enemyType.armor, enemyType.critChance);
	var fighting = true;

	while(fighting) {
		if(Player.healthTotal > 0) {
			Player.attack(enemy);
			if(enemy.healthTotal > 0) {
				enemy.attack(Player);
			}
			else {
				fighting = false;
				Player.pickUpLoot();
				Player.pickUpGold();
				Player.updateStats();
				GameState.setCurrentMoment(window['moment'+GameState.currentMoment.link]);
			}
		} 
		else {
			fighting = false;
			UI.combatLog.renderCombatLog('You were slain by '+enemy.name+'');
			Player.updateStats();
			GameState.setCurrentMoment(playerLost);
		}
	}
};

document.addEventListener('DOMContentLoaded', function(){
	Player.updateStats();
	Player.updateGold(50);
});