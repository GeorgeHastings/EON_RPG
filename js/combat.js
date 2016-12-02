'use strict';

var Combat = {
  fighting: true,
  rounds: 0,
  generateEnemy: function() {
    var enemyType = getObj(Enemies, GameState.currentMoment.enemy);
    var enemy = enemyType.constructor.name === 'Enemy' ? buildNormalEnemy(enemyType.name, enemyType.level) : buildCustomEnemy(enemyType.name, enemyType.level, enemyType.healthTotal, enemyType.equippedWeapon.name, enemyType.armor, enemyType.quicknessProc);
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
    var hasEnoughExp = Player.experience > Player.calcNexLevelExp();
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
    UI.combatLog.renderCombatLog(colorize(Combat.enemy.name+' attacks!', UI.colors.red));
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
