'use strict';

var Tut = {
  enabled: false,
  currentTut: {
    name: '',
    index: 0
  },
  tuts: {
    equipping: [
      {
        title: 'Tutorials',
        message: 'Hey there, these blue boxes will appear to help you get an idea of what\'s going on.',
        positionTo: ['.inventory-list li', 'bottom:left'],
        eventHandler: 'Sounds good',
        eventType: 'onclick',
      },
      {``
        title: 'Equipping items',
        message: function(){return 'You found a weapon! When equipped, weapons and armor apply their stats to your character. Click on that '+Player.inventory[0].name+' now to equip.';},
        positionTo: ['.inventory-list li', 'bottom:left'],
        eventHandler: '.inventory-list li',
        eventType: 'onclick',
      },
      {
        title: 'Understanding stats',
        message: 'These are your stats. Increasing them with items and leveling up makes you more powerful. Hover over them to see what they do.',
        positionTo: ['[data-stat="damage"]', 'bottom:left'],
        eventHandler: '[data-stat="damage"]',
        eventType: 'onmouseleave',
      }
    ],
    healing: [
      {
        title: 'Combat',
        message: 'You\'re probably wondering WTF just happened? In combat, you exchange damage with an enemy until one of your health reaches 0. Victory rewards you with loot, gold, and experience points. Defeat means you start over.',
        positionTo: ['.combat-log-container', 'top:right'],
        eventHandler: 'Got it',
        eventType: 'onclick'
      },
      {
        title: 'Healing yourself',
        message: 'You\'ll usually get injured in combat. Some items, like this egg, restore health points. Heals can be used anytime, even while fighting. Try using it now.',
        positionTo: ['[data-item="Chicken Egg"]', 'bottom:left'],
        eventHandler: '[data-item="Chicken Egg"]',
        eventType: 'onclick'
      }
    ]
  },

  initTut: function(tutSet) {
    if(document.querySelector('#Tut')){
      Tut.removeTut();
    }
    if(Tut.enabled) {
      Tut.currentTut.name = tutSet;
      Tut.currentTut.index = 0;
      Tut.renderTut(Tut.tuts[tutSet][Tut.currentTut.index]);
    }
  },

  positionTut: function(wrapper, tut) {
    var position = document.querySelector(tut.positionTo[0]).getBoundingClientRect();
    var verticalOrientation = tut.positionTo[1].split(':')[0];
    var horizontalOrientation = tut.positionTo[1].split(':')[1];
    var outOfScreenTop = position.top - position.height - wrapper.offsetHeight <= 0;
    var outOfScreenBottom = position.top + position.height + wrapper.offsetHeight >= window.innerHeight;
    var outOfScreenLeft = position.left <= 0;
    var outOfScreenRight = position.right + wrapper.offsetWidth > window.innerWidth;

    switch (verticalOrientation) {
      case 'top':
        if(outOfScreenTop) {
          wrapper.style.top = '15px';
        }
        else {
          wrapper.style.top = position.top - position.height - wrapper.offsetHeight + 'px';
        }
        break;
      case 'bottom':
        if(outOfScreenBottom) {
          wrapper.style.top = position.height - wrapper.offsetHeight - 15  + 'px';
        }
        else {
          wrapper.style.top = position.top + position.height + 'px';
        }
    }
    switch (horizontalOrientation) {
      case 'left':
        if(outOfScreenLeft) {
          wrapper.style.left = '15px';
        }
        else {
          wrapper.style.left = position.left + 'px';
        }
        break;
      case 'right':
        if(outOfScreenRight) {
          wrapper.style.right = '15px';
        }
        else {
          wrapper.style.right = position.right + 'px';
        }
    }
  },

  renderTut: function(tut) {
    var tutLength = Tut.tuts[Tut.currentTut.name].length;
    var wrapper = document.createElement('div');
    var header = document.createElement('div');
    var title = document.createTextNode(tut.title);
    var text = document.createElement('div');
    var element;
    var originalFn;

    if(document.querySelector(tut.eventHandler)) {
      element = document.querySelector(tut.eventHandler);
      originalFn = element[tut.eventType];
    }
    else {
      var button = document.createElement('div');
      var buttonText = document.createTextNode(tut.eventHandler);
      button.classList.add('tut-button');
      button.appendChild(buttonText);
      wrapper.appendChild(button);
      element = button;
      originalFn = null;
    }

    if(tutLength > 1) {
      header.appendChild(document.createTextNode((Tut.currentTut.index+1) + '/' + tutLength + ' - '));
    }

    if(typeof tut.message === 'function') {
      text.appendChild(document.createTextNode(tut.message()));
    }
    else {
      text.appendChild(document.createTextNode(tut.message));
    }

    text.classList.add('tut-text');
    header.classList.add('tut-header');
    header.appendChild(title);
    wrapper.appendChild(header);
    wrapper.appendChild(text);
    wrapper.id = 'Tut';
    wrapper.classList = 'tutorial-tip';

    var resolveFn = function(){
        if (originalFn !== null ) {
          originalFn.call(element, arguments);
          Tut.nextTut.call(Tut, tut.eventType, element, originalFn);
        }
        else {
          Tut.nextTut.call(Tut, tut.eventType, element, originalFn);
        }
    };

    element[tut.eventType] = resolveFn;
    document.body.appendChild(wrapper);
    Tut.positionTut(wrapper, tut);
  },

  removeTut: function() {
    document.getElementById('Tut').style.opacity = 0;
    setTimeout(function() {
      document.getElementById('Tut').remove();
    }, 300);
  },

  nextTut: function(eventType, element, originalFn) {
    if(originalFn !== undefined) {
      element[eventType] = originalFn;
    }
    else {
      element.removeEventListener(eventType);
    }
    Tut.removeTut();
    var multipleTuts = Tut.tuts[Tut.currentTut.name].length > 1;
    var notLastTut = Tut.currentTut.index !== Tut.tuts[Tut.currentTut.name].length - 1;
    if(multipleTuts && notLastTut) {
      Tut.currentTut.index++;
      Tut.renderTut(Tut.tuts[Tut.currentTut.name][Tut.currentTut.index]);
    }
  }
};
