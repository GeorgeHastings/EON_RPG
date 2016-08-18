"use strict";var StatBuff=function(t,e,a){this.amt=t,this.stats=e,this.description=a},QuestEffect=function(t,e){this.description=t,this.content=e};QuestEffect.prototype.run=function(){UI.combatLog.renderCombatLog(this.content)},StatBuff.prototype.run=function(){var t=this.amt;forEach(this.stats,function(e){Player[e]+=t})},StatBuff.prototype.desc=function(){return this.description},StatBuff.prototype.removeBuff=function(){for(var t=0;t<this.stats.length;t++)Player[this.stats[t]]-=this.amt};var Heal=function(t,e,a){this.amt=t,this.stats=e,this.description=a,this.logMessage=colorize("You",UI.colors.player)+" are "+colorize("healed","#24fb27")+" for "+colorize(this.amt,"#24fb27")};Heal.prototype=new StatBuff,Heal.prototype.run=function(){var t=Player.healthMax-Player.healthTotal;this.amt<=t?Player.healthTotal+=this.amt:Player.healthTotal+=t,UI.combatLog.renderCombatLog(this.logMessage)};var addToughness=function(t){return new StatBuff(t,["toughness","healthTotal","healthMax","armor"],"toughness +"+t)},addQuickness=function(t){return new StatBuff(t,["quickness"],"Quickness +"+t)},addQuicknessAndtoughness=function(t){return new StatBuff(t,["quickness","toughness"],"Quickness +"+t+"<br>toughness +"+t)},healPlayer=function(t){return new Heal(t,["healthTotal"],"Restore "+t+" hp")},DamageBuff=function(t,e,a){this.amt=t,this.stats=e,this.description=a};DamageBuff.prototype=new StatBuff,DamageBuff.prototype.run=function(){var t;Player.equippedWeapon?(Player.equippedWeapon.damage[this.stats]+=this.amt,t="Your "+colorize(Player.equippedWeapon.name,UI.colors[Player.equippedWeapon.rarity])+"'s max attack is increased by "+this.amt):t="You need to equip a weapon to use this",UI.combatLog.renderCombatLog(t)};var buffMaxDamage=function(t){return new DamageBuff(t,1,"Increase your equipped weapons max damage by "+t)},buffMinDamage=function(t){return new DamageBuff(t,0,"Increase your equipped weapons min damage by "+t)},ItemProc=function(t,e,a){this.amt=t,this.chance=e,this.description=a};ItemProc.prototype.run=function(){var t=roll(0,100);return t<=this.chance?!0:void 0},ItemProc.prototype.desc=function(){return this.description};var quickStrike=function(t,e){return new ItemProc(t,e,""+e+"% chance to deal an additional "+t+" damage")};