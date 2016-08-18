'use strict';

var UI = {
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

    renderShopItem: function(item) {
      var itemEl = document.createElement('a');
      var itemText = document.createTextNode(item.name);
      itemEl.setAttribute('data-item', item.name);
      UI.itemDescription.bindEvents(itemEl);
      itemEl.appendChild(itemText);
      UI.narrative.el.appendChild(itemEl);
      itemEl.onclick = Player.purchaseItem;
    },

    renderShop: function() {
      var shopList = map(GameState.currentMoment.shop, GameState.processRandomLoot);
      forEach(shopList, UI.narrative.renderShopItem);
      bindToMany('#inventory [data-item]', 'onclick', Player.sellItem);
    },

    renderChoice: function(choice) {
      var choiceEl = document.createElement('a');
      var choiceText = document.createTextNode(choice.message);
      choiceEl.setAttribute('data-moment', choice.link);
      choiceEl.appendChild(choiceText);
      choiceEl.onclick = UI.narrative.getMomentByClick;
      UI.narrative.el.appendChild(choiceEl);
    },

    renderChoices: function() {
      var choices = GameState.currentMoment.choices;
      forEach(choices, UI.narrative.renderChoice);
    },

    renderMoment: function() {
      UI.narrative.el.innerHTML = '';
      var messageWrapper = document.createElement('p');
      var messageText = document.createTextNode(GameState.currentMoment.message);
      messageWrapper.appendChild(messageText);
      UI.narrative.el.appendChild(messageWrapper);
    }
  },

  statlist: {
    el: document.getElementById('stat-list'),

    renderStat: function(stat) {
      var thisStat = stat.parentNode.getAttribute('data-stat');
      stat.innerHTML = Player[thisStat];
    },

    renderStats: function() {
      var stats = this.el.querySelectorAll('div');
      forEach(stats, this.renderStat);
    }
  },

  inventory: {
    el: document.getElementById('inventory'),
    gold: document.getElementById('gold'),

    renderInventoryItem(item) {
      var itemWrapper = document.createElement('li');
      var itemText = document.createTextNode(item.name);
      var momentIsShop = GameState.currentMoment.hasOwnProperty('shop');
      var armorIsEquipped = item.itemType === 'armor' && item === Player.equippedArmor[item.slot];
      var isEquippedWep = Player.equippedWeapon && item === Player.equippedWeapon;
      itemWrapper.appendChild(itemText);
      itemWrapper.setAttribute('data-item', item.name);
      UI.itemDescription.bindEvents(itemWrapper);
      UI.inventory.el.appendChild(itemWrapper);


      if (momentIsShop) {
        GameState.bindShopItemEvents();
      } else {
        GameState.bindWorldItemEvents();
      }

      if (isEquippedWep) {
        UI.inventory.renderEquippedWeapon(itemWrapper);
      }

      if(armorIsEquipped) {
        itemWrapper.classList.add('equipped-armor');
      }
    },

    removeInventoryItem: function(element) {
      element.remove();
    },

    renderInventory: function() {
      this.el.innerHTML = '';
      forEach(Player.inventory, this.renderInventoryItem);
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
      var item = getObj(Items.all, thisItemId);
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
        Player.removeFromInventory(item, this);
        UI.itemDescription.hideItemDescription();
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
      var item = getObj(Items.all, thisItemId);
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
      wep: Player.equippedWeapon,
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
        var avg = (this.wep.damage[0] + this.wep.damage[1]) / 2;
        var weightedAvg = (avg + (Player.quicknessProc / 100 * avg));
        var hasProcEffect = this.wep.effect && this.wep.effect.constructor.name === 'ItemProc';
        if(hasProcEffect) {
          var chance = this.wep.effect.chance / 100;
          var amt = this.wep.effect.amt;
          weightedAvg = (weightedAvg + chance * amt);
        }
        return '' + weightedAvg.toFixed(2) + ' average total damage per hit';
      },
      toughness: function() {
        return 'Increases armor and max health by ' + Player.toughness + '';
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

    bindEvents: function(element) {
      element.onmouseenter = UI.itemDescription.renderItemDescription;
      element.onmousemove = UI.itemDescription.position;
      element.onmouseleave = UI.itemDescription.hideItemDescription;
    },

    bindItemDescriptionEvents: function() {
      bindToMany('[data-item]', 'onmouseenter', this.renderItemDescription);
      bindToMany('[data-stat]', 'onmouseenter', this.renderStatDescription);
      bindToMany('[data-item], [data-stat]', 'onmousemove', this.position);
      bindToMany('[data-item], [data-stat]', 'onmouseleave', this.hideItemDescription);
    },
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
      var multipleLoots = loot.length > 0;
      var oneLoot = loot.length === 1;
      var defeatedEnemy;
      var foundLoot;
      var conj;
      if(moment.enemy) {
        defeatedEnemy = ' defeated '+colorize(moment.enemy, '#fff')+'';
      }
      else {
        defeatedEnemy = '';
      }
      if(multipleLoots) {
        foundLoot = ' found';
        if(oneLoot) {
          var item = loot[0];
          // console.log(item);
          foundLoot += ' '+colorize(item.name, UI.colors[item.rarity])+'';
        }
        else {
          forEach(loot, function(item) {
            if(loot.indexOf(item) < loot.length-1) {
                foundLoot += ' '+colorize(item.name, UI.colors[item.rarity])+',';
            }
            else {
              foundLoot += ' and '+colorize(item.name, UI.colors[item.rarity])+'';
            }
          });
        }
      }
      else {
        foundLoot = '';
      }
      if(moment.enemy && multipleLoots) {
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
