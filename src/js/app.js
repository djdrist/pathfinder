import Game from './components/Game.js';

const app = {
	init: function () {
		const thisApp = this;
		thisApp.initGame();
	},
	initGame() {
		const thisApp = this;
		thisApp.game = new Game();
	},
};
app.init();
