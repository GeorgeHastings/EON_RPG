'use strict';

var Moments = {
	moment1: {
		message: 'You are suddenly conscious, and remember nothing.',
		choices: [{message: 'Blink',link: 2}],
		// dropLoot: ['Heartsbane', 'Centurian Cask', 'Double Edged Katana']
	},
	moment2: {
		message: 'You are standing in a dark woods.',
		choices: [{message: 'Check your belongings',link: 4},{message: 'Look around',link: 3}]
	},
	moment3: {
		message: 'The sun has just set. You are surrounded by trees bathed in twilight.',
		choices: [{message: 'Start walking',link: 5}]
	},
	moment4: {
		message: 'Looped to your belt you find a weapon. Click on it in your inventory to equip it.',
		choices: [{message: 'Look around',link: 3},{message: 'Start Walking',link: 5}],
		dropLoot: [getRandomLootByLevel(Weapons, 1)]
	},
	moment5: {
		message: 'You walk until you see a glowing light spidering through the trees.',
		choices: [{message: 'Take a closer look',link: 6},{message: 'Continue on',link: 9}]
	},
	moment6: {
		message: 'From behind a tree you see a hunter stoking a fire. With him is a man tied up, slumped at the base of a tree.',
		choices: [{message: 'Fight',link: 8},{message: 'Continue on',link: 9}]
	},
	moment8: {
		message: 'You draw your weapon and charge.',
		enemy: 'Vagrant Ranger',
		dropLoot: [getRandomLootByLevel(Armors, 1), 'Chicken Egg'],
		link: 10
	},
	moment9: {
		message: 'You find a road and begin walking west. Up ahead you see a figure on horseback galloping towards you.',
		choices: [{message: 'Keep walking',link: 14},{message: 'Hide',link: 15}]
	},
	moment10: {
		message: 'After taking a minute to recover, you turn to the captured man. You\'re damaged. Try clicking on the chicken egg to heal yourself.',
		choices: [{message: '"Where am I?"',link: 11},{message: 'Take a closer look',link: 12}]
	},
	moment12: {
		message: 'As you lean in to check if the man is alive, he suddenly lunges at you.',
		enemy: 'Derranged Lunatic',
		dropLoot: [getRandomLootByLevel(Armors, 1), 'Message'],
		link: 13
	},
	moment13: {
		message: 'You notice a lockbox on the ground near the fire.',
		choices: [{message: 'Check it out',link: '13a'}, {message: 'Continue on',link: 9}],
	},
	moment13a: {
		message: 'There\'s nothing else here.',
		choices: [{message: 'Continue on',link: 9}],
		dropLoot: [getRandomLootByLevel(Items, 1), getRandomLootByLevel(Consumables, 1)]
	},
	moment14: {
		message: 'As the man gets closer, he draws a sword.',
		choices: [{message: 'Fight',link: 16},{message: 'Hide',link: 15}]
	},
	moment15: {
		message: 'You run into the trees until you cannot see the road. You hear the figure pass. Ahead of you is a ruined mill.',
		choices: [{message: 'Check out the mill',link: 17},{message: 'Go back to the road',link: 18}]
	},
	moment16: {
		message: 'You draw your weapon and stand your ground.',
		enemy: 'Highway Bandit',
		dropLoot: [getRandomLootByLevel(Items, 2)],
		link: 18
	},
	moment17: {
		message: 'You approach the shoddy old mill until you can hear voices coming from inside.',
		choices: [{message: 'Take a peek',link: '17a'},{message: 'Bust in there',link: '17b'},{message: 'Go back to the road',link: 18}]
	},
	moment17b: {
		message: '"Who the fuck are you?" says Sinclair Black, a notable thief.',
		choices: [{message: '"Your mom"',link: '17c'},{message: 'Punch him in the face',link: '17c'},{message: 'Run away',link: 18}]
	},
	moment17c: {
		message: '"You bitch, I will end you."',
		enemy: 'Sinclair Graves',
		dropLoot: ['Wind Blade', 'Jerky'],
		link: 18
	},
	moment18: {
		message: 'You walk for miles until you see a steeple poking up from the treeline ahead. It seems you found a town.',
		choices: [{message: 'Look around',link: 19},{message: 'Talk to someone',link: 20}]
	},
	moment19: {
		message: 'You walk to the town square and look around. Where would you like to go?',
		choices: [{message: 'The Arms Shop',link: 20},{message: 'The General Store',link: 21}, {message: 'The Inn',link: 22}, {message: 'The Town Hall',link: 24}]
	},
	moment20: {
		message: 'You enter the arms shop. "Ahoy there traveler," says the owner. "What can I do for you?"',
		shop: [getRandomLootByLevel(Weapons, 1), getRandomLootByLevel(Weapons, 1), getRandomLootByLevel(Weapons, 2), getRandomLootByLevel(Weapons, 2), getRandomLootByLevel(Armors, 2)],
		choices: [{message: 'Leave the shop', link: 19}]
	},
	moment21: {
		message: 'You enter the general store. "Hey baby," says the clerk. "What can I help you with?"',
		shop: [getRandomLootByLevel(Consumables, 1), getRandomLootByLevel(Consumables, 1), getRandomLootByLevel(Consumables, 2), getRandomLootByLevel(Consumables, 2)],
		choices: [{message: 'Leave the shop', link: 19}]
	},
	moment22: {
		message: 'You enter the inn. "Sup playa," says the innkeeper. "Would you like a room? Its 2 gold for the night."',
		choices: [{message: 'Yes please', link: 23}, {message: 'No thanks', link: 19}]
	},
	moment23: {
		message: 'You go up to your room and sleep off your wounds. You wake up feeling like a million bucks.',
		inn: 2,
		choices: [{message: 'Leave the inn', link: 19}, {message: 'Get another room', link: 23}]
	},
	moment24: {
		message: 'You stand in the large chamber of the Town Hall. Merchants and town leaders are assembled in discussion.',
		choices: [{message: 'Leave the hall', link: 19}, {message: 'Look around', link: 25}, {message: 'Ask for Jawn Peterson', link: 26}, {message: 'Talk to the tenant-in-chief', link: 27}]
	},
	moment26: {
		message: 'You approach a man writing at a desk near the entrance. "Do you know a man who goes by Jawn Peterson?" you ask. "The man points to two men standing near a side entrance."',
		choices: [{message: 'Go over', link: 27}, {message: 'Do something else', link: 24}]
	},
	moment27: {
		message: 'The men spot you approaching. "Are you Jawn Peterson? you ask." He seems to look you over until replying "Yes I am. Would you like to join me for a drink? You look like you could use it."',
		choices: [{message: 'Go with him', link: 28}, {message: 'Do something else', link: 24}]
	},
	moment28: {
		message: 'You walk outside and turn the corner. The cloaked man with Jawn Peterson suddenly pulls a dagger on you and attacks.',
		enemy: 'Cloaked Assassin',
		dropLoot: [getRandomLootByLevel(Items, 2)],
		link: 24
	},
	playerLost: {
		message: 'You were killed. Sorry.',
		choices: [{message: 'Start over',link: 1}]
	}
};
