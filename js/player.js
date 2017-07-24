'use strict';

var Player = {
  name: 'You',
  level: 1,
  healthMax: 25,
  healthTotal: 25,
  armor: 0,
  toughness: 0,
  quickness: 1,
  equippedWeapon: '',
  equippedArmor: {
    head: '',
    chest: '',
    back: '',
    belt: '',
    pants: '',
    boots: ''
  },
  inventory: [],
  gold: 0,
  experience: 0,

  levelUp: function() {
    this.level = this.level + 1;
    this.toughness = this.toughness + 1;
    this.quickness = this.quickness + 1;
    this.healthTotal = this.healthMax;
    this.updateStats();
    UI.combatLog.renderCombatLog(GameState.messages.gainLvl);
  },

  calcNexLevelExp: function() {
    var nextLevelExp = 50;
    for(var i = 0; i < this.level; i++) {
      nextLevelExp = nextLevelExp + (i+1)*20;
    }
    return nextLevelExp;
  },

  updateExperience: function(exp) {
    this.experience = this.experience + exp;
    UI.combatLog.renderCombatLog(colorize('You', '#fff')+' gained '+colorize(exp +' experience.', '#fff'));
  },

  updateStats: function() {
    this.setHealth();
    this.setDamage();
    this.setArmor();
    this.setToughness();
    this.setDamageReduction();
    this.setQuicknessProc();
    UI.statlist.renderStats();
  },

  updateGold: function(amt) {
    this.gold += amt;
    UI.inventory.renderGold();
  },

  setHealth: function() {
    this.health = '' + this.healthTotal + '/' + this.healthMax + '';
    // UI.combat.updateHealthBar();
  },

  setArmor: function() {
    this.armor = 0;
    for (var item in this.equippedArmor) {
      if(this.equippedArmor[item].armorAmt) {
        this.armor += this.equippedArmor[item].armorAmt;
      }
    }
    this.armor += this.toughness;
  },

  setDamage: function() {
    if (this.equippedWeapon) {
      this.damage = '' + this.equippedWeapon.damage[0] + '-' + this.equippedWeapon.damage[1] + '';
    } else {
      this.damage = '0-2';
    }
  },

  setDamageReduction: function() {
    this.damageReduction = (1 - (0.03 * this.armor) / (1 + 0.03 * this.armor)).toFixed(2);
  },

  setToughness: function() {
    this.healthMax = 25 + this.toughness;
  },

  setQuicknessProc: function() {
    this.quicknessProc = ((0.02 * this.quickness) / ((1 + 0.02 * this.quickness)) * 100).toFixed(2);
  },

  getBaseDamage: function() {
    return this.equippedWeapon ? roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]) : roll(0,3);
  },

  rollQuicknessProc: function() {
  	return roll(0, 100) <= this.quicknessProc ? true : false;
  },

  attack: function(target) {
    var damageDealt = Math.round(this.getBaseDamage() * target.damageReduction);
    var procExists;
    var procFires;
    var procHit = '';
    var hitType = 'hit';
    var hitColor = 'yellow';
    var criticallyHit = this.rollQuicknessProc();
    var targetDodged = target.rollQuicknessProc();
    var hitMessage;

    if(this.equippedWeapon.effect) {
      var effects = this.equippedWeapon.effect;
      procExists = effects[effects.length - 1].constructor.name === 'itemProc';
      procFires = effects[effects.length - 1].run();
    }
    if (criticallyHit) {
      damageDealt = damageDealt * 2;
      hitType = ''+colorize('critically hit', UI.colors.red)+'';
      hitColor = UI.colors.red;
    }
    if (procExists && procFires) {
      var proc = effects[effects.length - 1];
      var attackerName;
      if(this.name === 'You') {attackerName = 'Your';}
      else {attackerName = this.name + '\'s';}
      target.healthTotal -= proc.amt;
      procHit = ' and '+colorize(this.equippedWeapon.name, UI.colors[this.equippedWeapon.rarity])+' hits for '+colorize(proc.amt, 'yellow');
    }
    if (targetDodged) {
      UI.combatLog.renderCombatLog(colorize(target.healthTotal, colorHealth(target.healthTotal/target.healthMax)) + ' ' + colorize(target.name, UI.colors.entity) + ' '+colorize('dodged', 'yellow')+' ' + colorize(this.name, UI.colors.entity) + ' for 0');
    } else {
      target.healthTotal -= damageDealt;
      hitMessage = colorize(this.healthTotal, colorHealth(this.healthTotal/this.healthMax)) + ' ' + colorize(this.name, UI.colors.entity) + ' ' + hitType + ' ' + colorize(target.name, UI.colors.entity) + ' for '+colorize(damageDealt, hitColor);
      UI.combatLog.renderCombatLog(hitMessage + procHit);
    }
    Player.updateStats();
  },

  pickUpGold: function() {
    var multiplier = getObj(Enemies, GameState.currentMoment.enemy).level;
    var gold = roll(4, 8) * multiplier;
    Player.updateGold(gold);
    UI.combatLog.renderCombatLog(''+colorize('You', UI.colors.player)+' found ' + colorize(gold + ' gold.', UI.colors.gold));
  },

  pickUpLoot: function() {
    var items = map(GameState.currentMoment.dropLoot, GameState.processRandomLoot);
    forEach(items, Player.addToInventory);
    UI.combatLog.renderLootMessage(items);
  },

  addToInventory: function(item) {
    Player.inventory.push(item);
    UI.inventory.renderInventoryItem(item);
  },

  removeFromInventory: function(item, element) {
    removeFromArr(this.inventory, item);
    UI.inventory.removeInventoryItem(element);
  },

  equipWeapon: function(item) {
    if(this.equippedWeapon){
      this.unequipCurrentWeapon();
    }
    this.equippedWeapon = item;
    this.updateStats();
  },

  equipArmor: function(item) {
    var itemInSlotExists = this.equippedArmor[item.slot];
    if(itemInSlotExists) {
      Player.unequipArmor(this.equippedArmor[item.slot]);
    }
    this.equippedArmor[item.slot] = item;
    this.updateStats();
  },

  unequipArmor: function(armor) {
    this.equippedArmor[armor.slot] = '';
    if(armor.effect) {
      forEachMethod(armor.effect, 'remove');
    }
  },

  removeWepBuff: function(effect) {
    var isStatbuff = effect.constructor.name === 'statBuff';
    if (isStatbuff === true) {
      effect.remove();
    }
  },

  unequipCurrentWeapon: function() {
    var wep = this.equippedWeapon;
    if(wep.effect) {
      forEach(wep.effect, this.removeWepBuff);
    }
    if (wep) {
      wep = '';
    }
  },

  purchaseItem: function() {
    var itemId = this.getAttribute('data-item');
    var item = getObj(Items.all, itemId);
    var NewPlayerHasEnoughGold = Player.gold >= item.getPurchasePrice();
    if (NewPlayerHasEnoughGold) {
      Player.updateGold(-item.getPurchasePrice());
      Player.addToInventory(item);
      UI.combatLog.renderItemTransaction(colorize(item.name, UI.colors[item.rarity]), item.getPurchasePrice(), 'bought');
    } else {
      UI.combatLog.renderCannotPurchaseMessage(colorize(item.name, UI.colors[item.rarity]), item.getPurchasePrice());
    }
  },

  sellItem: function() {
    var itemId = this.getAttribute('data-item');
    var item = getObj(Items.all, itemId);
    Player.updateGold(item.getSalePrice());

    if (item === Player.equippedWeapon) {
      Player.unequipCurrentWeapon();
    }
    if (item === Player.equippedArmor[item.slot]) {
      Player.unequipArmor(item);
    }
    Player.removeFromInventory(item, this);
    Player.updateStats();
    UI.itemDescription.hideItemDescription();
    UI.combatLog.renderItemTransaction(colorize(item.name, UI.colors[item.rarity]), item.getSalePrice(), 'sold');
  },

  reset: function() {
    this.name = 'You';
    this.level = 1;
    this.healthMax = 25;
    this.healthTotal = 25;
    this.armor = 0;
    this.toughness = 0;
    this.quickness = 1;
    this.equippedWeapon = '';
    this.equippedArmor = {
      head: '',
      chest: '',
      back: '',
      belt: '',
      pants: '',
      boots: ''
    };
    this.inventory = [];
    this.gold = 0;
    this.experience = 0;
    Player.updateStats();
    Player.updateGold(0);
  }
};
