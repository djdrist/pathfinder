import Path from './components/Path.js';
import { select } from './settings.js';

const app = {
	init: function () {
		const thisApp = this;
		thisApp.initNav();
		thisApp.initPath();
	},
	initNav() {
		const thisApp = this;
		thisApp.dom = {};
		thisApp.dom.navLinks = document.querySelectorAll(select.elements.links);
		thisApp.dom.about = document.querySelector(select.elements.about);
		thisApp.dom.finder = document.querySelector(select.elements.finder);
		for (let link of thisApp.dom.navLinks) {
			console.log(link);
			link.addEventListener('click', function (event) {
				event.preventDefault();
				thisApp.page = event.target.hash.replace('#', '');
				switch (thisApp.page) {
					case 'about':
						thisApp.dom.about.style.display = 'block';
						thisApp.dom.finder.style.display = 'none';
						break;
					case 'finder':
						thisApp.dom.about.style.display = 'none';
						thisApp.dom.finder.style.display = 'block';
						break;
				}
			});
		}
	},

	initPath() {
		const thisApp = this;
		thisApp.path = new Path();
	},
};
app.init();
