'use strict';

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
    var hasEnoughExp = Player.experience > Player.calcNexLevelExp();
    Player.updateExperience(exp);
    if(hasEnoughExp) {
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
