"use strict";var GameState={currentMoment:"",setCurrentMoment:function(e){this.currentMoment=e,UI.narrative.renderMoment(),this.checkForAndCreateChoices(),this.checkForAndPickUpLoot(),this.checkForAndRunCombat(),this.checkForAndOpenUpShop(),UI.scrollToBottom(UI.narrative.el)},checkForFoundLoot:function(){return this.currentMoment.hasOwnProperty("dropLoot")&&!this.currentMoment.hasOwnProperty("enemy")},checkForAndPickUpLoot:function(){this.checkForFoundLoot()&&Player.pickUpLoot()},checkForAndRunCombat:function(){this.currentMoment.hasOwnProperty("enemy")&&runCombat()},checkForAndOpenUpShop:function(){this.currentMoment.hasOwnProperty("shop")&&UI.narrative.renderShop()},checkForAndCreateChoices:function(){this.currentMoment.hasOwnProperty("choices")&&UI.narrative.renderChoices()}},Player={name:"You",healthMax:25,healthTotal:25,armor:0,strength:0,quickness:1,equippedWeapon:"",equippedArmor:"",inventory:[],gold:0,updateStats:function(){this.setHealth(),this.setDamage(),this.setArmor(),this.setDamageReduction(),this.setCritChance(),UI.statlist.renderStats()},updateGold:function(e){this.gold+=e,UI.inventory.renderGold()},setHealth:function(){this.health=""+this.healthTotal+"/"+this.healthMax},setArmor:function(){this.equippedArmor&&(this.armor=this.equippedArmor.armorAmt+this.strength)},setDamage:function(){this.equippedWeapon?this.damage=""+this.equippedWeapon.damageMin+"-"+this.equippedWeapon.damageMax:this.damage="0-2"},setDamageReduction:function(){this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)},setStrength:function(){this.healthTotal=this.healthTotal+this.strength,this.healthMax=this.healthMax+this.strength},setCritChance:function(){this.critChance=(.02*this.quickness/(1+.02*this.quickness)*100).toFixed(2)},getBaseDamage:function(){var e;e=this.equippedWeapon?roll(this.equippedWeapon.damageMin,this.equippedWeapon.damageMax):roll(0,3),this.baseDamage=e},rollCriticalHit:function(){var e=roll(0,100);return e<=this.critChance?!0:!1},attack:function(e){this.getBaseDamage();var t=(this.baseDamage*e.damageReduction).toFixed(0),n="hit";this.rollCriticalHit()&&(t=2*t,n="critically hit"),e.healthTotal-=t,UI.combatLog.renderCombatLog("("+this.healthTotal+") "+this.name+" "+n+" "+e.name+" for "+t)},pickUpLoot:function(){for(var e=0;e<GameState.currentMoment.dropLoot.length;e++){var t=GameState.currentMoment.dropLoot[e];this.addToInventory(t)}UI.combatLog.renderLootMessage()},addToInventory:function(e){var t=getObj(Items,e);this.inventory.push(t),UI.inventory.renderInventory()},removeFromInventory:function(e){var t=this.inventory.indexOf(e);t>-1&&this.inventory.splice(t,1)},equipWeapon:function(e){this.unequipCurrentWeapon(),this.equippedWeapon=getObj(Weapons,e),Player.updateStats()},equipArmor:function(e){this.unequipCurrentArmor(),this.equippedArmor=getObj(Armors,e),Player.updateStats()},unequipCurrentWeapon:function(){this.equippedWeapon&&this.equippedWeapon.removeEquipBuff()},unequipCurrentArmor:function(){this.equippedArmor&&(this.armor-=this.equippedArmor.armorAmt)},purchaseItem:function(){var e=this.getAttribute("data-item");Player.addToInventory(e)}},UI={items:document.querySelectorAll("[data-item]"),colors:{none:"#999",common:"#fff",rare:"#4D75CE",epic:"#9E65C4",legendary:"#C6AF66"},narrative:{el:document.getElementById("narrative"),getMomentByClick:function(){var e=this.getAttribute("data-moment");GameState.setCurrentMoment(window["moment"+e])},renderShop:function(){for(var e=GameState.currentMoment.shop,t=0;t<e.length;t++){var n=getObj(Items,e[t]),r=document.createElement("a"),o=document.createTextNode(n.name);r.setAttribute("data-item",n.name),r.appendChild(o),UI.narrative.el.appendChild(r),r.onclick=Player.purchaseItem}UI.items=document.querySelectorAll("[data-item]"),UI.itemDescription.bindItemDescriptionEvents()},renderChoices:function(){for(var e=GameState.currentMoment.choices,t=0;t<e.length;t++){var n=e[t],r=document.createElement("a"),o=document.createTextNode(n.message);r.setAttribute("data-moment",n.link),r.appendChild(o),UI.narrative.el.appendChild(r),r.onclick=this.getMomentByClick}},renderMoment:function(){var e=document.createElement("p"),t=document.createTextNode(GameState.currentMoment.message);e.appendChild(t),UI.narrative.el.appendChild(e)}},statlist:{el:document.getElementById("stat-list"),renderStats:function(){for(var e=this.el.querySelectorAll("dd"),t=0;t<e.length;t++){var n=e[t].getAttribute("data-stat");e[t].innerHTML=Player[n]}}},inventory:{el:document.getElementById("inventory"),gold:document.getElementById("gold"),renderInventory:function(){this.el.innerHTML="";for(var e=0;e<Player.inventory.length;e++){var t=Player.inventory[e],n=document.createElement("li"),r=document.createTextNode(t.name);n.appendChild(r),this.el.appendChild(n),n.setAttribute("data-item",t.name),n.onclick=this.activateItem,t===Player.equippedWeapon&&this.renderEquippedWeapon(n),t===Player.equippedArmor&&this.renderEquippedArmor(n)}UI.items=document.querySelectorAll("[data-item]"),UI.itemDescription.bindItemDescriptionEvents()},renderGold:function(){UI.inventory.gold.innerHTML=Player.gold},removeEquippedWepTag:function(){var e=document.querySelector(".equipped-wep");e&&e.setAttribute("class","")},removeEquippedArmorTag:function(){for(var e=document.querySelectorAll(".equipped-armor"),t=0;t<e.length;t++)e[t].setAttribute("class","")},activateItem:function(){var e=this.getAttribute("data-item"),t=getObj(Items,e);"weapon"===t.itemType&&Player.equippedWeapon!==t&&(Player.equipWeapon(e),UI.inventory.renderEquippedWeapon(this),t.use()),"armor"===t.itemType&&Player.equippedArmor!==t&&(Player.equipArmor(e),UI.inventory.renderEquippedArmor(this),t.use()),"consumable"===t.itemType&&(Player.removeFromInventory(t),UI.itemDescription.hideItemDescription(),UI.inventory.renderInventory(),t.use())},renderEquippedWeapon:function(e){this.removeEquippedWepTag(),e.setAttribute("class","equipped-wep")},renderEquippedArmor:function(e){this.removeEquippedArmorTag(),e.setAttribute("class","equipped-armor")}},itemDescription:{el:document.getElementById("itemDescription"),components:{displayName:document.getElementById("displayName"),itemAttack:document.getElementById("itemAttack"),itemArmor:document.getElementById("itemArmor"),itemEffect:document.getElementById("itemEffect"),flavorText:document.getElementById("flavorText")},getItemDescriptionY:function(e){var t=e.pageY;return""+t+"px"},getItemDescriptionX:function(e){var t=e.pageX;return""+t+"px"},positionItemDescription:function(e){UI.itemDescription.el.style.top=UI.itemDescription.getItemDescriptionY(e),UI.itemDescription.el.style.left=UI.itemDescription.getItemDescriptionX(e)},showItemDescription:function(){UI.itemDescription.el.style.display="block"},hideItemDescription:function(){UI.itemDescription.el.style.display="none",UI.itemDescription.components.itemAttack.innerHTML="",UI.itemDescription.components.itemEffect.innerHTML=""},renderItemDescription:function(){var e=this.getAttribute("data-item"),t=getObj(Items,e);UI.itemDescription.components.displayName.innerHTML=t.name,UI.itemDescription.components.displayName.style.color=UI.colors[t.rarity],UI.itemDescription.components.flavorText.innerHTML=t.flavorText,"weapon"===t.itemType&&(UI.itemDescription.components.itemAttack.innerHTML="Damage: "+t.damageMin+"-"+t.damageMax),"armor"===t.itemType&&(UI.itemDescription.components.itemAttack.innerHTML="Armor: "+t.armorAmt),t.effect&&(UI.itemDescription.components.itemEffect.innerHTML=t.desc()),UI.itemDescription.showItemDescription()},getStatDescriptions:{health:function(){return"If you run out, you die."},armor:function(){return"Reduces damage taken to "+(100*Player.damageReduction).toFixed(2)+"%"},quickness:function(){return""+Player.critChance+"% chance to critical hit"},damage:function(){return"Average damage is "+(Player.equippedWeapon.damageMax+Player.equippedWeapon.damageMin)/2},strength:function(){return"Increases armor and max health by "+Player.strength}},renderStatDescription:function(){var e=this.getAttribute("data-stat");UI.itemDescription.components.displayName.innerHTML=e,UI.itemDescription.components.displayName.style.color="white",UI.itemDescription.components.flavorText.innerHTML="",UI.itemDescription.components.itemAttack.innerHTML=UI.itemDescription.getStatDescriptions[e](),UI.itemDescription.showItemDescription()},bindItemDescriptionEvents:function(){for(var e=document.querySelectorAll("[data-item]"),t=document.querySelectorAll("[data-stat]"),n=0;n<e.length;n++)e[n].onmouseenter=this.renderItemDescription,e[n].onmousemove=this.positionItemDescription,e[n].onmouseleave=this.hideItemDescription;for(var r=0;r<t.length;r++)t[r].onmouseenter=this.renderStatDescription,t[r].onmousemove=this.positionItemDescription,t[r].onmouseleave=this.hideItemDescription}},combatLog:{el:document.getElementById("combatLog"),renderCombatLog:function(e){var t=document.createElement("p"),n=document.createTextNode(e);t.appendChild(n),this.el.appendChild(t),UI.scrollToBottom(UI.combatLog.el)},renderLootMessage:function(){var e=GameState.currentMoment;if(e.enemy)if(e.dropLoot.length>0){var t=e.dropLoot;this.renderCombatLog("You defeated the "+e.enemy+" and found "+t+".")}else this.renderCombatLog("You defeated the "+e.enemy+".");else this.renderCombatLog("You found "+e.dropLoot)}},scrollToBottom:function(e){e.scrollTop=e.scrollHeight}},roll=function(e,t){return Math.floor(Math.random()*(t-e+1))+e},getObj=function(e,t){var n=e.filter(function(e){return e.name===t});return n?n[0]:null},getObjLvl=function(e,t){for(var n=[],r=0;r<e.length;r++)e[r].level===t&&n.push(e[r]);return n},getRandomLootByLevel=function(e,t){var n=getObjLvl(e,t);return n[roll(0,n.length-1)].name},runCombat=function(){for(var e=getObj(Enemies,GameState.currentMoment.enemy),t=new Enemy(e.name,e.level,e.healthTotal,getObj(Items,e.equippedWeapon),e.armor,e.critChance),n=!0;n;)Player.healthTotal>0?(Player.attack(t),t.healthTotal>0?t.attack(Player):(n=!1,Player.pickUpLoot(),Player.updateStats(),GameState.setCurrentMoment(window["moment"+GameState.currentMoment.winLink]))):(n=!1,UI.combatLog.renderCombatLog("You were slain by "+t.name),Player.updateStats(),GameState.setCurrentMoment(playerLost))};document.addEventListener("DOMContentLoaded",function(){Player.updateStats(),Player.updateGold(0)});