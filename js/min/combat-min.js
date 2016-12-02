"use strict";var Combat={fighting:!0,rounds:0,generateEnemy:function(){var e=getObj(Enemies,GameState.currentMoment.enemy),t=new Enemy(e.name,e.level,e.healthTotal,getObj(Items.weapons,e.equippedWeapon),e.armor,e.critChance);t.healthMax=t.healthTotal,Combat.enemy=t},playerWins:function(){Combat.fighting=!1,Player.pickUpLoot(),Player.pickUpGold(),Combat.awardExperience(),GameState.setCurrentMoment(Moments["moment"+GameState.currentMoment.link])},playerLoses:function(){Combat.fighting=!1,UI.combatLog.renderCombatLog(""+colorize("You",UI.colors.player)+" were slain by "+colorize(Combat.enemy.name,"#fff")),Player.updateStats(),GameState.setCurrentMoment(Moments.playerLost)},awardExperience:function(){var e=this.rounds+15*Combat.enemy.level,t=Player.experience>Player.calcNexLevelExp();Player.updateExperience(e),t&&Player.levelUp()},fight:function(e){var t,a,n=Combat.enemy;e%2?(t=n,a=Player):(t=Player,a=n),t.healthTotal>0?t.attack(a):t===n?Combat.playerWins():Combat.playerLoses()},runCombat:function(){var e,t=0;Combat.generateEnemy(),UI.combatLog.renderCombatLog(colorize("You engage "+Combat.enemy.name,UI.colors.red)),e=setInterval(function(){Combat.fighting?(t++,Combat.fight(t)):(clearInterval(e),Combat.fighting=!0,Combat.rounds=t)},700)}};