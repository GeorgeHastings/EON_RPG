'use strict';

var moment1 = {
	message: 'You are suddenly conscious, and remember nothing.',
	choices: [{message: 'Blink',link: 2}]
};

var moment2 = {
	message: 'You are standing in a dark woods.',
	choices: [{message: 'Look around',link: 3},{message: 'Check your belongings',link: 4}]
};

var moment3 = {
	message: 'The sun has just set. You are surrounded by trees bathed in twilight.',
	choices: [{message: 'Start walking',link: 5}]
};

var moment4 = {
	message: 'Looped to your belt you find a muddy hatchet.',
	choices: [{message: 'Look around',link: 3},{message: 'Start Walking',link: 5}],
	dropLoot: [getRandomLootByLevel(Weapons, 1)]
};

var moment5 = {
	message: 'You walk until you see a glowing light spidering through the trees.',
	choices: [{message: 'Take a closer look',link: 6},{message: 'Continue on',link: 9}]
};

var moment6 = {
	message: 'From behind a tree you see a goblin stoking a fire. With him is a man tied up, slumped at the base of a tree.',
	choices: [{message: 'Fight',link: 8},{message: 'Continue on',link: 9}]
};

var moment8 = {
	message: 'You step out and rush at the goblin.',
	enemy: 'Goblin Loan Shark',
	dropLoot: [getRandomLootByLevel(Armors, 1), 'Chicken Egg'],
	winLink: 10
};

var moment9 = {
	message: 'You find a road and begin walking west. Up ahead you see a figure on horseback galloping towards you.',
	choices: [{message: 'Keep walking',link: 14},{message: 'Hide',link: 15}]
};

var moment10 = {
	message: 'After taking a minute to recover, you turn to the captured man.',
	choices: [{message: '"Who are you?"',link: 11},{message: 'Take a closer look',link: 12}]
};

var moment12 = {
	message: 'As you lean in to check if the man is alive, he suddenly lunges at you.',
	enemy: 'Derranged Lunatic',
	dropLoot: [getRandomLootByLevel(Armors, 1), 'Message'],
	winLink: 13
};

var moment13 = {
	message: 'You done beat the ol maniac. Next to him is a locked chest. Since youre such a lock pro, you open that shit up no problem.',
	choices: [{message: 'Continue on',link: 9}],
	findLoot: [getRandomLootByLevel(Consumables, 1)]
};

var moment14 = {
	message: 'As the man gets closer, he draws a sword.',
	choices: [{message: 'Fight',link: 16},{message: 'Hide',link: 15}]
};

var moment15 = {
	message: 'You run into the trees until you cannot see the road. You hear the figure pass. Ahead of you is a ruined mill.',
	choices: [{message: 'Check out the mill',link: 17},{message: 'Go back to the road',link: 18}]
};

var moment16 = {
	message: 'You draw your weapon and stand your ground.',
	enemy: 'Highway Bandit',
	dropLoot: [getRandomLootByLevel(Items, 1)],
	winLink: 18
};

var moment18 = {
	message: 'You walk for miles until you see a steeple poking up from the treeline ahead. It seems you found a town.',
	choices: [{message: 'Look around',link: 19},{message: 'Talk to someone',link: 20}]
};

var moment19 = {
	message: 'You walk to the town square and look around. Where would you like to go?',
	choices: [{message: 'The Arms Shop',link: 20},{message: 'The General Store',link: 21}, {message: 'The Inn',link: 22}, {message: 'The Town Hall',link: 23}]
};

var playerLost = {
	message: 'You were killed. Sorry.',
	choices: [{message: 'Start over',link: 1}]
};

var moment20 = {
	message: 'You enter the arms shop. "Ahoy there traveler," says the owner. "What can I do for you?"',
	shop: [getRandomLootByLevel(Weapons, 1), getRandomLootByLevel(Weapons, 1), getRandomLootByLevel(Weapons, 2), getRandomLootByLevel(Weapons, 2)],
	choices: [{message: 'Leave the shop', link: 19}]
};