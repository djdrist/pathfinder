/* eslint-disable no-debugger */
import { select, settings } from '../settings.js';

class Game {
	constructor() {
		const thisGame = this;
		thisGame.getElements();
		thisGame.initBorders();
		thisGame.initActions();
	}
	getElements() {
		const thisGame = this;
		thisGame.dom = {};
		thisGame.dom.board = document.querySelector(select.gameElements.board);
		thisGame.dom.button = document.querySelector(select.gameElements.button);
	}

	initActions() {
		const thisGame = this;
		thisGame.activeCells = [];
		thisGame.dom.board.addEventListener('click', function (event) {
			const buttonState = thisGame.dom.button.innerHTML;
			const cellId = event.target.getAttribute(select.gameElements.cellId);
			thisGame.dom.checkedCell = thisGame.dom.board.querySelector(`[data-id="${cellId}"]`);
			if (buttonState == settings.button.start) {
				thisGame.addCell(cellId);
			} else if (buttonState == settings.button.end) {
				thisGame.selectPoints(cellId);
			}
		});
		thisGame.dom.button.addEventListener('click', function () {
			const buttonState = thisGame.dom.button.innerHTML;
			if (buttonState == settings.button.start) {
				thisGame.dom.button.innerHTML = settings.button.end;
			}
			if (buttonState == settings.button.end && thisGame.startPoint >= 0 && thisGame.endPoint >= 0) {
				thisGame.dom.button.innerHTML = settings.button.reset;
				thisGame.calcRoute();
			}
			if (buttonState == settings.button.reset) {
				thisGame.resetGame();
				thisGame.dom.button.innerHTML = settings.button.start;
			}
		});
	}
	initBorders() {
		const thisGame = this;
		thisGame.borderLeft = [];
		thisGame.borderRight = [];
		const rows = settings.game.rows;
		const cols = settings.game.cols;
		for (let i = rows - 1; i < rows * cols; i += rows) {
			thisGame.borderRight.push(i);
		}
		for (let i = 0; i < rows * cols; i += cols) {
			thisGame.borderLeft.push(i);
		}
	}

	addCell(cellId) {
		const thisGame = this;
		const checkedCell = thisGame.dom.checkedCell;
		if (thisGame.activeCells.length === 0) {
			checkedCell.classList.add(select.styles.active);
			thisGame.lastCell = cellId;
			thisGame.activeCells.push(cellId);
			thisGame.renderOptions(cellId);
		} else if (checkedCell.classList.contains(select.styles.option)) {
			checkedCell.classList.remove(select.styles.option);
			checkedCell.classList.add(select.styles.active);
			thisGame.lastCell = cellId;
			thisGame.activeCells.push(cellId);
			thisGame.renderOptions(cellId);
		} else if (thisGame.lastCell == cellId && checkedCell.classList.contains(select.styles.active)) {
			checkedCell.classList.remove(select.styles.active);
			thisGame.deleteOptions();
		}
	}
	renderOptions(cellId) {
		const thisGame = this;
		thisGame.lastOptions = [];
		cellId = parseInt(cellId);
		let options = [-settings.game.rows, settings.game.rows];
		if (thisGame.borderRight.includes(cellId)) {
			options.push(-1);
		} else if (thisGame.borderLeft.includes(cellId)) {
			options.push(1);
		} else {
			options.push(-1, 1);
		}
		options.forEach(function (element) {
			const cell = parseInt(cellId) + element;
			const optionCell = thisGame.dom.board.querySelector(`[data-id="${cell}"]`);
			if (
				cell >= 0 &&
				cell < settings.game.rows * settings.game.cols &&
				!optionCell.classList.contains(select.styles.active) &&
				!optionCell.classList.contains(select.styles.option)
			) {
				optionCell.classList.add(select.styles.option);
				thisGame.lastOptions.push(cell);
			}
		});
	}
	deleteOptions() {
		const thisGame = this;
		thisGame.activeCells.pop();
		thisGame.lastOptions.forEach(function (element) {
			const cell = parseInt(element);
			const optionCell = thisGame.dom.board.querySelector(`[data-id="${cell}"]`);
			optionCell.classList.remove(select.styles.option);
		});
		if (thisGame.activeCells.length !== 0) {
			thisGame.dom.checkedCell.classList.add(select.styles.option);
		}
		if (thisGame.lastOptions.length == 0 && thisGame.activeCells.length !== 0) {
			const lastCell = thisGame.dom.board.querySelector(`[data-id="${thisGame.lastCell}"]`);
			lastCell.classList.add(select.styles.option);
		}
	}
	selectPoints(cellId) {
		const thisGame = this;
		if (thisGame.startPoint == undefined && thisGame.activeCells.includes(cellId)) {
			thisGame.startPoint = cellId;
			thisGame.dom.checkedCell.classList.remove(select.styles.active);
			thisGame.dom.checkedCell.classList.add(select.styles.startPoint);
		} else if (thisGame.startPoint >= 0 && thisGame.startPoint != cellId && thisGame.endPoint == undefined && thisGame.activeCells.includes(cellId)) {
			thisGame.endPoint = parseInt(cellId);
			thisGame.dom.checkedCell.classList.remove(select.styles.active);
			thisGame.dom.checkedCell.classList.add(select.styles.endPoint);
		}
	}

	calcRoute() {
		const thisGame = this;
		thisGame.activeCells.splice(thisGame.activeCells.indexOf(thisGame.startPoint), 1);
		thisGame.cells = [];
		thisGame.activeCells.forEach(function (element) {
			thisGame.cells.push(parseInt(element));
		});
		thisGame.pathNumber = 0;
		thisGame.path = {};
		thisGame.path[thisGame.pathNumber] = [];
		thisGame.path[thisGame.pathNumber].push(parseInt(thisGame.startPoint));
		thisGame.initSearch();
		console.log(thisGame.path['success']);
		console.log(thisGame.path);
		thisGame.clearAndShow();
	}

	initPath(startPoint, pathNumber) {
		const thisGame = this;
		const newPath = thisGame.pathNumber + 1;
		thisGame.path[newPath] = [];
		thisGame.path[pathNumber].forEach(function (element) {
			thisGame.path[newPath].push(element);
		});
		//thisGame.path[newPath].pop();
		thisGame.path[newPath].push(parseInt(startPoint));
		thisGame.pathNumber = thisGame.pathNumber + 1;
	}

	initNextRound() {
		const thisGame = this;
		thisGame.initSearch();
	}

	initSearch() {
		const thisGame = this;
		for (let i = 0; i <= thisGame.pathNumber; i++) {
			let lastElement = thisGame.path[i].length - 1;
			let lastCell = thisGame.path[i][lastElement];
			if (lastCell >= 0) {
				thisGame.findNext(lastCell, i);
			}
		}
		if (thisGame.success != 0) {
			console.log('NOT FOUND');
			thisGame.initNextRound();
		} else {
			console.log('FOUND');
		}
	}
	findNext(point, pathNumber) {
		const thisGame = this;
		let options = [-settings.game.rows, settings.game.rows];
		let nextPoint = [];
		if (thisGame.borderRight.includes(point)) {
			options.push(-1);
		} else if (thisGame.borderLeft.includes(point)) {
			options.push(1);
		} else {
			options.push(-1, 1);
		}
		for (let option of options) {
			const x = point + option;
			if (x == thisGame.endPoint) {
				thisGame.success = 0;
				thisGame.path['success'] = thisGame.path[pathNumber];
				thisGame.path['success'].shift();
				break;
			} else if (x >= 0 && x < settings.game.rows * settings.game.cols && thisGame.cells.includes(x) && !thisGame.path[pathNumber].includes(x)) {
				nextPoint.push(x);
			}
		}
		if (thisGame.success != 0) {
			thisGame.renderRoutes(nextPoint, pathNumber);
		}
	}
	renderRoutes(points, pathNumber) {
		const thisGame = this;
		if (points.length == 0) {
			thisGame.path[pathNumber].push(-100);
		}
		if (points.length == 1) {
			thisGame.path[pathNumber].push(points[0]);
		}
		if (points.length == 2) {
			thisGame.initPath(points[1], pathNumber);
			thisGame.path[pathNumber].push(points[0]);
		}
		if (points.length == 3) {
			thisGame.initPath(points[1], pathNumber);
			thisGame.initPath(points[2], pathNumber);
			thisGame.path[pathNumber].push(points[0]);
		}
	}
	clearAndShow() {
		const thisGame = this;
		for (let i = 0; i < settings.game.rows * settings.game.cols; i++) {
			const currentCell = thisGame.dom.board.querySelector(`[data-id="${i}"]`);
			if (currentCell.classList.contains(select.styles.option)) {
				currentCell.classList.remove(select.styles.option);
			}
			if (currentCell.classList.contains(select.styles.active)) {
				currentCell.classList.remove(select.styles.active);
			}
		}
		thisGame.path['success'].forEach(function (element) {
			const pathCell = thisGame.dom.board.querySelector(`[data-id="${element}"]`);
			pathCell.classList.add(select.styles.path);
		});
	}
	resetGame() {
		const thisGame = this;
		thisGame.path['success'].forEach(function (element) {
			const pathCell = thisGame.dom.board.querySelector(`[data-id="${element}"]`);
			pathCell.classList.remove(select.styles.path);
		});
		const startCell = thisGame.dom.board.querySelector(`[data-id="${thisGame.startPoint}"]`);
		const endCell = thisGame.dom.board.querySelector(`[data-id="${thisGame.endPoint}"]`);
		startCell.classList.remove(select.styles.startPoint);
		endCell.classList.remove(select.styles.endPoint);
		thisGame.activeCells = [];
		thisGame.startPoint = undefined;
		thisGame.endPoint = undefined;
		thisGame.success = undefined;
	}
}

export default Game;
