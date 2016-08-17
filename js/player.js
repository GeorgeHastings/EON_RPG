'use strict';

var Player = {
  name: 'You',
  level: 1,
  healthMax: 25,
  healthTotal: 25,
  armor: 0,
  strength: 0,
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
    this.strength = this.strength + 1;
    this.quickness = this.quickness + 1;
    this.healthTotal = this.healthMax;
    this.updateStats();
    UI.combatLog.renderCombatLog(GameState.messages.gainLvl);
  },

  calcNexLevelExp: function() {
    var nextLevelExp = 80;
    for(var i = 0; i < Player.level; i++) {
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
    this.setStrength();
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
  },

  setArmor: function() {
    this.armor = 0;
    for (var item in this.equippedArmor) {
      if(this.equippedArmor[item].armorAmt) {
        this.armor += this.equippedArmor[item].armorAmt;
      }
    }
    this.armor += this.strength;
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

  setStrength: function() {
    this.healthMax = 25 + this.strength;
  },

  setQuicknessProc: function() {
    this.quicknessProc = ((0.02 * this.quickness) / ((1 + 0.02 * this.quickness)) * 100).toFixed(2);
  },

  getBaseDamage: function() {
    var baseDamage;
    if (this.equippedWeapon) {
      baseDamage = roll(this.equippedWeapon.damage[0], this.equippedWeapon.damage[1]);
    } else {
      baseDamage = roll(0, 3);
    }
    this.baseDamage = baseDamage;
  },

  rollQuicknessProc: function() {
    var result = roll(0, 100);
    if (result <= this.quicknessProc) {
      return true;
    } else {
      return false;
    }
  },

  attack: function(target) {
    this.getBaseDamage();
    var damageDealt = Math.round(this.baseDamage * target.damageReduction);
    var hitType = 'hit';
    var hitColor = 'yellow';
    if (this.rollQuicknessProc()) {
      damageDealt = damageDealt * 2;
      hitType = ''+colorize('critically hit', UI.colors.red)+'';
      hitColor = UI.colors.red;
    }
    if (target.rollQuicknessProc()) {
      UI.combatLog.renderCombatLog(colorize(target.healthTotal, colorHealth(target.healthTotal/target.healthMax)) + ' ' + colorize(target.name, UI.colors.entity) + ' '+colorize('dodged', 'yellow')+' ' + colorize(this.name, UI.colors.entity) + ' for 0');
    } else {
      target.healthTotal -= damageDealt;
      UI.combatLog.renderCombatLog(colorize(this.healthTotal, colorHealth(this.healthTotal/this.healthMax)) + ' ' + colorize(this.name, UI.colors.entity) + ' ' + hitType + ' ' + colorize(target.name, UI.colors.entity) + ' for <span style="color: '+hitColor+';">' + damageDealt + '</span>');
    }
    if (target !== Player && Player.equippedWeapon.effect) {
      if (Player.equippedWeapon.effect.constructor.name === 'ItemProc' && Player.equippedWeapon.effect.run()) {
        target.healthTotal -= Player.equippedWeapon.effect.amt;
        UI.combatLog.renderCombatLog('Your '+colorize(Player.equippedWeapon.name, UI.colors[Player.equippedWeapon.rarity])+' strikes ' + colorize(target.name, UI.colors.entity) + ' for <span style="color: '+hitColor+';">' + Player.equippedWeapon.effect.amt + '</span>');
      }
    }
    Player.updateStats();
  },

  pickUpGold: function() {
    var multiplier = getObj(Enemies, GameState.currentMoment.enemy).level;
    var gold = roll(4, 8) * multiplier;
    Player.updateGold(gold);
    UI.combatLog.renderCombatLog(''+colorize('You', UI.colors.player)+' found ' + colorize(gold + ' gold.', UI.colors.gold));
  },

  pickUpLoot: function(items) {
    forEach(items, this.addToInventory);
    UI.combatLog.renderLootMessage();
  },

  addToInventory: function(item) {
    Player.inventory.push(item);
    UI.inventory.renderInventory();
  },

  removeFromInventory: function(itemId) {
    var thisItem = getObj(this.inventory, itemId);
    removeFromArr(this.inventory, thisItem);
  },

  equipWeapon: function(item) {
    this.unequipCurrentWeapon();
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
      forEachMethod(armor.effect, 'removeBuff');
    }
  },

  removeWepBuff: function(wep) {
    var isStatbuff = wep.constructor.name === 'StatBuff';
    if (isStatbuff === true) {
      wep.removeBuff();
    }
  },

  unequipCurrentWeapon: function() {
    var wep = this.equippedWeapon;
    if(wep.effect) {
      forEach(wep.effect, Player.removeWepBuff);
    }
    if (wep) {
      wep = '';
    }
  },

  purchaseItem: function() {
    var itemId = this.getAttribute('data-item');
    var item = getObj(Items.all, itemId);
    var playerHasEnoughGold = Player.gold >= item.getPurchasePrice();
    if (playerHasEnoughGold) {
      Player.updateGold(-item.getPurchasePrice());
      Player.addToInventory(itemId);
      UI.inventory.renderInventory();
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

    Player.removeFromInventory(itemId);
    Player.updateStats();
    UI.itemDescription.hideItemDescription();
    UI.inventory.renderInventory();
    UI.combatLog.renderItemTransaction(colorize(item.name, UI.colors[item.rarity]), item.getSalePrice(), 'sold');
  }
};
