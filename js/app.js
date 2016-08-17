'use strict';

requirejs.config({
    baseUrl: 'js',
});

requirejs(['gamestate', 'player', 'ui', 'combat', 'enemies', 'effects', 'items', 'moments'], function() {
  Player.updateStats();
  Player.updateGold(0);
});

var colorize = function(str, color) {
  return '<span style="color: '+color+';">'+str+'</span>';
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

var removeFromArr = function(arr, val) {
  var index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }
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

var forEach = function(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    fn(arr[i]);
  }
};

var forEachMethod = function(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    arr[i][fn]();
  }
};

var bindToMany = function(elements, eventType, fn) {
  var els = document.querySelectorAll(elements);
  for(var i = 0; i < els.length; i++) {
    els[i][eventType] = fn;
  }
};

var getRandomLootByLevel = function(type, level) {
  var itemsOfLevel = getObjLvl(Items[type], level);
  return itemsOfLevel[roll(0, itemsOfLevel.length - 1)];
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
