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
    this.checkForAndRunInn();
    this.checkForAndRunOnLoad();
    UI.scrollToBottom(UI.narrative.el);
  },

  checkForAndRunOnLoad: function() {
    if (this.currentMoment.hasOwnProperty('onLoad')) {
      this.currentMoment.onLoad();
    }
  },

  processRandomLoot: function(loot) {
    var item;
    if(typeof loot === 'object') {
      item = getRandomLootByLevel(loot[0], loot[1]);
    }
    else {
      item = getObj(Items.all, loot);
    }
    return item;
  },

  checkForAndPickUpLoot: function() {
    var lootIsDiscovered = this.currentMoment.hasOwnProperty('dropLoot') && !this.currentMoment.hasOwnProperty('enemy');
    if (lootIsDiscovered) {
      Player.pickUpLoot();
    }
  },

  checkForAndRunCombat: function() {
    if (this.currentMoment.hasOwnProperty('enemy')) {
      Combat.runCombat();
    }
  },

  checkForAndOpenUpShop: function() {
    if (this.currentMoment.hasOwnProperty('shop')) {
      UI.narrative.renderShop();
      this.bindShopItemEvents();
    } else {
      this.bindWorldItemEvents();
    }
  },

  checkForAndRunInn: function() {
    var innExists = this.currentMoment.hasOwnProperty('inn');
    if (innExists) {
      var price = this.currentMoment.inn;
      if (Player.gold >= price) {
        Player.updateGold(-price);
        Player.healthTotal = Player.healthMax;
        Player.updateStats();
        UI.combatLog.renderCombatLog(colorize('You', UI.colors.player)+ ' bought a room for '+colorize(price + ' gold', UI.colors.gold)+'.');
        UI.combatLog.renderCombatLog(colorize('Your', UI.colors.player) + ' health is '+colorize('fully restored', '#24fb27'));
      } else {
        UI.combatLog.renderCombatLog(colorize('You', UI.colors.player)+ ' need '+colorize(price - Player.gold, UI.colors.gold)+' to get a room.');
      }
    }
  },

  checkForAndCreateChoices: function() {
    var choicesExist = this.currentMoment.hasOwnProperty('choices');
    if (choicesExist) {
      UI.narrative.renderChoices();
    }
  },

  bindWorldItemEvents: function() {
    var intventoryItems = UI.inventory.el.querySelectorAll('[data-item]');
    for (var i = 0; i < intventoryItems.length; i++) {
      intventoryItems[i].onclick = UI.inventory.activateItem;
    }
  },

  bindShopItemEvents: function() {
    var shopItems = UI.narrative.el.querySelectorAll('[data-item]');
    var inventoryItems = UI.inventory.el.querySelectorAll('[data-item]');
    for (var i = 0; i < shopItems.length; i++) {
      shopItems[i].onclick = Player.purchaseItem;
    }
    for (var j = 0; j < inventoryItems.length; j++) {
      inventoryItems[j].onclick = Player.sellItem;
    }
  },

  messages: {
    gainLvl: colorize('You gained a level! Your toughness and quickness have increased by 1.', 'yellow')
  }
};
