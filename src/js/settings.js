export const select = {
	pathElements: {
		board: '.path-board',
		cell: '.path-cell',
		cellId: 'data-id',
		button: '.path-btn',
		info: '.path-info',
	},
	styles: {
		active: 'active',
		option: 'option',
		path: 'path',
		startPoint: 'start',
		endPoint: 'end',
		modalActive: 'modal_active',
	},
	elements: {
		links: 'nav a',
		about: '.about',
		finder: '.finder',
		full: '.modal_full',
		best: '.modal_best',
		modal: '.modal',
		modalClose: '.modal_close',
	},
};
export const settings = {
	path: {
		rows: 10,
		cols: 10,
	},
	button: {
		start: 'FINISH DRAWING',
		end: 'COMPUTE',
		reset: 'START AGAIN',
	},
	info: {
		start: 'DRAW ROUTES',
		end: 'PICK START AND FINISH',
		reset: 'THE BEST ROUTE IS...',
	},
	aos: {
		disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
		startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
		initClassName: 'aos-init', // class applied after initialization
		animatedClassName: 'aos-animate', // class applied on animation
		useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
		disableMutationObserver: false, // disables automatic mutations' detections (advanced)
		debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
		throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

		// Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
		offset: 120, // offset (in px) from the original trigger point
		delay: 0, // values from 0 to 3000, with step 50ms
		duration: 1000, // values from 0 to 3000, with step 50ms
		easing: 'ease', // default easing for AOS animations
		once: false, // whether animation should happen only once - while scrolling down
		mirror: false, // whether elements should animate out while scrolling past them
		anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
	},
};
