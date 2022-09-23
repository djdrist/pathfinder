import Path from './components/Path.js';

const app = {
	init: function () {
		const thisApp = this;
		thisApp.initPath();
	},
	initPath() {
		const thisApp = this;
		thisApp.path = new Path();
	},
};
app.init();
