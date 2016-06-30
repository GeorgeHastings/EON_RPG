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
  }
};

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
    UI.combatLog.renderCombatLog(colorize('You gained a level! Your strength and quickness have increased by 1.', 'yellow'));
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
      UI.combatLog.renderCombatLog('(' + colorize(target.healthTotal, colorHealth(target.healthTotal/target.healthMax)) + ') ' + colorize(target.name, UI.colors.entity) + ' '+colorize('dodged', 'yellow')+' ' + colorize(this.name, UI.colors.entity) + ' for 0');
    } else {
      target.healthTotal -= damageDealt;
      UI.combatLog.renderCombatLog('(' + colorize(this.healthTotal, colorHealth(this.healthTotal/this.healthMax)) + ') ' + colorize(this.name, UI.colors.entity) + ' ' + hitType + ' ' + colorize(target.name, UI.colors.entity) + ' for <span style="color: '+hitColor+';">' + damageDealt + '</span>');
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
    var thisItem = getObj(this.inventory, itemId);
    var index = this.inventory.indexOf(thisItem);
    if (index > -1) {
      this.inventory.splice(index, 1);
    }
  },

  equipWeapon: function(item) {
    this.unequipCurrentWeapon();
    this.equippedWeapon = item;
    this.updateStats();
  },

  equipArmor: function(item) {
    this.equippedArmor[item.slot] = item;
    this.updateStats();
  },

  unequipArmor: function(armor) {
    this.equippedArmor[armor.slot] = '';
    if(armor.effect) {
      for(var i = 0; i < armor.effect.length; i++ ) {
        armor.effect[i].removeBuff();
      }
    }
  },

  unequipCurrentWeapon: function() {
    var wep = this.equippedWeapon;
    if(wep.effect) {
      for (var i = 0; i < wep.effect.length; i++ ) {
        var isStatbuff = wep.effect[i].constructor.name === 'StatBuff';
        if (isStatbuff === true) {
          console.log('up');
          wep.effect[i].removeBuff();
        }
      }
    }
    if (wep) {
      wep = '';
    }
  },

  purchaseItem: function() {
    var itemId = this.getAttribute('data-item');
    var item = getObj(Items, itemId);
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
    var item = getObj(Items, itemId);
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

var colorHealth = function(percentage) {
  var green = [36, 251, 39];
  var red = [255, 104, 57];
  var r = green[0],
      g = green[1],
      b = green[2];
  r = r + (red[0] - green[0])*(1 - percentage);
  g = g - (green[1] - red[1])*(1 - percentage);
  b = b + (red[2] - green[2])*(1 - percentage);
  return 'rgb('+r.toFixed(0)+', '+g.toFixed(0)+', '+b.toFixed(0)+')';
};

var UI = {
  items: document.querySelectorAll('[data-item]'),
  colors: {
    none: '#939DBD',
    common: '#fff',
    rare: '#4D75CE',
    epic: '#9E65C4',
    legendary: '#C6AF66',
    entity: '#fff',
    player: '#fff',
    enemy: '#fff',
    gold: '#E5CA48',
    red: '#ff6839'
  },

  narrative: {
    el: document.getElementById('narrative'),

    getMomentByClick: function() {
      var num = this.getAttribute('data-moment');
      GameState.setCurrentMoment(Moments['moment' + num + '']);
    },

    renderShop: function() {
      var shopList = GameState.currentMoment.shop;
      var inventoryItems = UI.inventory.el.querySelectorAll('[data-item]');

      for (var i = 0; i < shopList.length; i++) {
        var item = getObj(Items, shopList[i]);
        var itemEl = document.createElement('a');
        var itemText = document.createTextNode(item.name);
        itemEl.setAttribute('data-item', item.name);
        itemEl.appendChild(itemText);
        UI.narrative.el.appendChild(itemEl);
        itemEl.onclick = Player.purchaseItem;
      }

      for (var j = 0; j < inventoryItems.length; j++) {
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
      var stats = this.el.querySelectorAll('div');
      for (var i = 0; i < stats.length; i++) {
        var thisStat = stats[i].parentNode.getAttribute('data-stat');
        stats[i].innerHTML = Player[thisStat];
      }
    }
  },

  inventory: {
    el: document.getElementById('inventory'),
    gold: document.getElementById('gold'),

    renderInventory: function() {
      this.el.innerHTML = '';
      for (var i = 0; i < Player.inventory.length; i++) {
        var item = Player.inventory[i];
        var itemWrapper = document.createElement('li');
        var itemText = document.createTextNode(item.name);
        var momentIsShop = GameState.currentMoment.hasOwnProperty('shop');
        var armorIsEquipped = item.itemType === 'armor' && item === Player.equippedArmor[item.slot];
        itemWrapper.appendChild(itemText);
        itemWrapper.setAttribute('data-item', item.name);
        // itemWrapper.style.color = UI.colors[item.rarity];
        this.el.appendChild(itemWrapper);

        if (momentIsShop) {
          GameState.bindShopItemEvents();
        } else {
          GameState.bindWorldItemEvents();
        }

        if (item === Player.equippedWeapon) {
          this.renderEquippedWeapon(itemWrapper);
        }

        if(armorIsEquipped) {
          itemWrapper.classList.add('equipped-armor');
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
      if (currentWep) {
        currentWep.classList.remove('equipped-wep');
      }
    },

    removeEquippedArmorTag: function() {
      var allArmors = document.querySelectorAll('.equipped-armor');
      for (var i = 0; i < allArmors.length; i++) {
        allArmors[i].classList.remove('equipped-armor');
      }
    },

    renderEquippedWeapon: function(itemWrapper) {
      this.removeEquippedWepTag();
      itemWrapper.classList.add('equipped-wep');
    },

    renderEquippedArmor: function() {
      this.removeEquippedArmorTag();
      for (var armor in Player.equippedArmor) {
        if(Player.equippedArmor[armor].name) {
          UI.inventory.el.querySelector('[data-item="' + Player.equippedArmor[armor].name + '"').classList.add('equipped-armor');
        }
      }
    },

    activateItem: function() {
      var thisItemId = this.getAttribute('data-item');
      var item = getObj(Items, thisItemId);
      var isUnequippedWep = item.itemType === 'weapon' && Player.equippedWeapon !== item;
      var isUnequippedArmor = item.itemType === 'armor' && item !== Player.equippedArmor[item.slot];

      if (isUnequippedWep) {
        Player.equipWeapon(item);
        UI.inventory.renderEquippedWeapon(this);
        item.use();
      }
      if (isUnequippedArmor) {
        Player.equipArmor(item);
        UI.inventory.renderEquippedArmor();
        item.use();
      }
      if (item.itemType === 'consumable') {
        Player.removeFromInventory(thisItemId);
        UI.itemDescription.hideItemDescription();
        UI.inventory.renderInventory();
        item.use();
      }
      if(item.itemType === 'quest') {
        item.use();
      }
    },
  },

  itemDescription: {
    el: document.getElementById('itemDescription'),
    items: document.getElementById('descItems'),
    initialX: 0,
    initialY: 0,

    getInitialY: function(event) {
      var yPos = event.pageY;
      UI.itemDescription.intialY = yPos;
      return yPos;

    },

    getInitialX: function(event) {
      var xPos = event.pageX;
      UI.itemDescription.intialX = xPos;
      return xPos;
    },

    position: function(event) {
      var d = UI.itemDescription;
      var winWidth = window.innerWidth;
      var winHeight = window.innerHeight;
      var x = d.getInitialX(event);
      var y = d.getInitialY(event);
      var translation = 'translate3d('+x+'px,'+y+'px, 0)';
      if(event.pageX + (d.el.offsetWidth + 10) > winWidth) {
        d.el.style.left = (d.initialX - d.el.offsetWidth - 10) + 'px';
      }
      else {
        d.el.style.left = d.initialX + 10 + 'px';
      }
      if(event.pageY + (d.el.offsetHeight + 10) > winHeight) {
        d.el.style.top = (d.initialY - d.el.offsetHeight - 10) + 'px';
      }
      else {
        UI.itemDescription.el.style.top = d.initialY + 10 + 'px';
      }
      d.el.style.webkitTransform = translation;
      d.el.style.transform = translation;
    },

    showItemDescription: function() {
      UI.itemDescription.el.style.display = 'block';
    },

    hideItemDescription: function() {
      UI.itemDescription.el.style.display = 'none';
    },

    createEl: function(text, className) {
      var el = document.createElement('div');
      var textNode = document.createTextNode(text);
      el.classList.add(className);
      el.appendChild(textNode);
      return el;
    },

    renderItemDescription: function() {
      UI.itemDescription.items.innerHTML = '';
      var thisItemId = this.getAttribute('data-item');
      var item = getObj(Items, thisItemId);
      var property;

      for (var prop in item) {
        if (typeof item[prop] !== 'function') {
          if(prop === 'damage') {
            property = UI.itemDescription.createEl(item[prop][0]+'-'+item[prop][1], ''+prop+'');
          }
          else {
            property = UI.itemDescription.createEl(item[prop], ''+prop+'');
          }
          if (prop === 'effect'){
            property = UI.itemDescription.createEl(item[prop].description, ''+prop+'');
            for(var i = 0; i < item.effect.length; i++ ) {
              property = UI.itemDescription.createEl(item[prop][i].description, ''+prop+'');
              UI.itemDescription.items.appendChild(property);
            }
          }
          if(prop === 'rarity') {
            document.querySelector('.name').style.color = UI.colors[item[prop]];
          }
          if(prop === 'flavorText' && item[prop] === '') {

          }
          else {
            UI.itemDescription.items.appendChild(property);
          }
        }
        else if (prop === 'getSalePrice' && this.parentNode === UI.inventory.el){
          property = UI.itemDescription.createEl(item[prop](), ''+prop+'');
          UI.itemDescription.items.appendChild(property);
          if(GameState.currentMoment.hasOwnProperty('shop')) {
            var sellItem = UI.itemDescription.createEl('(Click to sell)', 'shop-item');
            UI.itemDescription.items.appendChild(sellItem);
          }
        }
        else if (prop === 'getPurchasePrice' && this.parentNode === UI.narrative.el){
          property = UI.itemDescription.createEl(item[prop](), ''+prop+'');
          UI.itemDescription.items.appendChild(property);
          if(GameState.currentMoment.hasOwnProperty('shop')) {
            var buyItem = UI.itemDescription.createEl('(Click to buy)', 'shop-item');
            UI.itemDescription.items.appendChild(buyItem);
          }
        }
      }
      UI.itemDescription.showItemDescription();
    },

    getStatDescriptions: {
      level: function() {
        return 'You have '+Player.experience+' points. You need '+(Player.calcNexLevelExp() - Player.experience)+' to reach the next level.';
      },
      health: function() {
        return 'You have '+(Player.healthTotal/Player.healthMax*100).toFixed(0)+'% health';
      },
      armor: function() {
        return 'Reduces damage taken to ' + (Player.damageReduction * 100).toFixed(2) + '%';
      },
      quickness: function() {
        return '' + Player.quicknessProc + '% chance to critical hit and dodge';
      },
      damage: function() {
        var avg = (Player.equippedWeapon.damage[0] + Player.equippedWeapon.damage[1]) / 2;
        var weightedAvg = (avg + (Player.quicknessProc / 100 * avg));
        if(Player.equippedWeapon.effect && Player.equippedWeapon.effect.constructor.name === 'ItemProc') {
          var chance = Player.equippedWeapon.effect.chance / 100;
          var amt = Player.equippedWeapon.effect.amt;
          weightedAvg = (weightedAvg + chance * amt);
        }
        return '' + weightedAvg.toFixed(2) + ' average total damage per hit';
      },
      strength: function() {
        return 'Increases armor and max health by ' + Player.strength + '';
      }
    },

    renderStatDescription: function() {
      var thisStatId = this.getAttribute('data-stat');
      var statDesc = UI.itemDescription.getStatDescriptions[thisStatId]();
      var property = UI.itemDescription.createEl(statDesc, 'stat');
      UI.itemDescription.items.innerHTML = '';
      UI.itemDescription.items.appendChild(property);
      UI.itemDescription.showItemDescription();
    },

    bindItemDescriptionEvents: function() {
      var itemList = document.querySelectorAll('[data-item]');
      var statList = document.querySelectorAll('[data-stat]');

      for (var i = 0; i < itemList.length; i++) {
        itemList[i].onmouseenter = this.renderItemDescription;
        itemList[i].onmousemove = this.position;
        itemList[i].onmouseleave = this.hideItemDescription;
      }
      for (var j = 0; j < statList.length; j++) {
        statList[j].onmouseenter = this.renderStatDescription;
        statList[j].onmousemove = this.position;
        statList[j].onmouseleave = this.hideItemDescription;
      }
    }
  },

  combatLog: {
    el: document.getElementById('combatLog'),

    renderCombatLog: function(logitem) {
      var logitemWrapper = document.createElement('p');
      logitemWrapper.innerHTML = (logitem);
      this.el.appendChild(logitemWrapper);
      UI.scrollToBottom(UI.combatLog.el);
    },

    renderItemTransaction: function(name, price, transaction) {
      this.renderCombatLog(colorize('You', UI.colors.player) +' '+ transaction+' ' + name + ' for ' + colorize(price + ' gold', UI.colors.gold)+'.');
    },

    renderCannotPurchaseMessage: function(name, price) {
      this.renderCombatLog(colorize('You', UI.colors.player) + ' need ' + colorize(price - Player.gold + ' gold', UI.colors.gold) + ' to buy ' + name + '.');
    },

    renderLootMessage: function() {
      var moment = GameState.currentMoment;
      var loot = moment.dropLoot;
      var defeatedEnemy;
      var foundLoot;
      var conj;
      if(moment.enemy) {
        defeatedEnemy = ' defeated '+colorize(moment.enemy, '#fff')+'';
      }
      else {
        defeatedEnemy = '';
      }
      if(loot.length > 0) {
        foundLoot = ' found';
        if(loot.length === 1) {
          var item = getObj(Items, loot[0]);
          foundLoot += ' '+colorize(loot, UI.colors[item.rarity])+'';
        }
        else {
          for (var i = 0; i < loot.length; i++) {
            var item = getObj(Items, loot[i]);
            if(i < loot.length-1) {
                foundLoot += ' '+colorize(loot[i], UI.colors[item.rarity])+',';
            }
            else {
              foundLoot += ' and '+colorize(loot[i], UI.colors[item.rarity])+'';
            }
          }
        }
      }
      else {
        foundLoot = '';
      }
      if(moment.enemy && loot.length > 0) {
        conj = ' and';
      }
      else {
        conj = '';
      }
      this.renderCombatLog(colorize('You', UI.colors.player) + defeatedEnemy + conj + foundLoot + '.');
    },
  },

  scrollToBottom: function(pane) {
    pane.scrollTop = pane.scrollHeight;
  }
};

var Combat = {
  fighting: true,
  rounds: 0,
  generateEnemy: function() {
    var enemyType = getObj(Enemies, GameState.currentMoment.enemy);
    var enemy = new Enemy(enemyType.name, enemyType.level, enemyType.healthTotal, getObj(Items, enemyType.equippedWeapon), enemyType.armor, enemyType.critChance);
    enemy.healthMax = enemy.healthTotal;
    Combat.enemy = enemy;
  },
  playerWins: function() {
    Combat.fighting = false;
    Player.pickUpLoot();
    Player.pickUpGold();
    Combat.awardExperience();
    GameState.setCurrentMoment(Moments['moment' + GameState.currentMoment.link + '']);
  },
  playerLoses: function() {
    Combat.fighting = false;
    UI.combatLog.renderCombatLog(''+colorize('You', UI.colors.player)+' were slain by ' + colorize(Combat.enemy.name, '#fff') + '');
    Player.updateStats();
    GameState.setCurrentMoment(Moments.playerLost);
  },
  awardExperience: function() {
    var exp = this.rounds + 15*Combat.enemy.level;
    Player.updateExperience(exp);
    if(Player.experience > Player.calcNexLevelExp()) {
      Player.levelUp();
    }
  },
  fight: function(count) {
    var attacker;
    var defender;
    var enemy = Combat.enemy;
    if(count % 2) {
      attacker = enemy;
      defender = Player;
    }
    else {
      attacker = Player;
      defender = enemy;
    }
    if (attacker.healthTotal > 0) {
      attacker.attack(defender);
    } else if (attacker === enemy) {
      Combat.playerWins();
    }
    else {
      Combat.playerLoses();
    }
  },
  runCombat: function() {
    var thisCombat;
    var count = 0;
    Combat.generateEnemy();
    UI.combatLog.renderCombatLog(colorize('You engage '+Combat.enemy.name+'', UI.colors.red));
    thisCombat = setInterval(function() {
      if (Combat.fighting) {
        count++;
        Combat.fight(count);
      } else {
        clearInterval(thisCombat);
        Combat.fighting = true;
        Combat.rounds = count;
      }
    }, 700);
  }
};

var roll = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


var getObj = function(arr, val) {
  var result = arr.filter(function(o) {
    return o.name === val;
  });
  return result ? result[0] : null;
};

var getFromArr = function(arr, val) {
  var result = arr.filter(function(o) {
    return o.slot === val;
  });
  return result ? result[0] : null;
};

var getObjLvl = function(arr, val) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].level === val) {
      result.push(arr[i]);
    }
  }
  return result;
};

var colorize = function(str, color) {
  return '<span style="color: '+color+';">'+str+'</span>';
};

var getRandomLootByLevel = function(type, level) {
  var itemsOfLevel = getObjLvl(type, level);
  return itemsOfLevel[roll(0, itemsOfLevel.length - 1)].name;
};

document.addEventListener('DOMContentLoaded', function() {
  Player.updateStats();
  Player.updateGold(0);
});
