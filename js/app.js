'use strict';

Player.updateStats();
Player.updateGold(0);
UI.itemDescription.bindStatEvents();

var equipping = new Acquaint('equipping', [
  {
    title: 'Equipping items',
    message: function(){return 'You found a weapon! When equipped, weapons and armor apply their stats to your character. Click on that '+Player.inventory[0].name+' now to equip.';},
    target: '.inventory-list li',
    position: 'bottom-left',
    advance: {
      element: '.inventory-list li',
      event: 'onclick'
    }
  },
  {
    title: 'Understanding stats',
    message: 'These are your stats. Increasing them with items and leveling up makes you more powerful. Hover over them to see what they do.',
    target: '[data-stat="damage"]',
    position: 'bottom-left',
    button: 'Got it'
  }
]);

var healing = new Acquaint('healing', [
  {
    title: 'Combat',
    message: 'Well done. In combat, you exchange damage with an enemy until one of your health reaches 0. Victory rewards you with loot, gold, and experience points. Die, and you start over.',
    target: window,
    position: 'top-right',
    button: 'Got it',
  },
  {
    title: 'Healing yourself',
    message: 'You\'ll usually get injured in combat. Some items, like this egg, restore health points. Heals can be used anytime, even while fighting. Try using it now.',
    target: '[data-item="Chicken Egg"]',
    position: 'bottom-left',
    advance: {
      element: '[data-item="Chicken Egg"]',
      event: 'onclick'
    }
  }
]);
