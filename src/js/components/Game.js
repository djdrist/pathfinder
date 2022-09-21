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
	}
	initActions() {
		const thisGame = this;
		thisGame.dom.board.addEventListener('click', function (event) {
			thisGame.checkCell(event.target.getAttribute(select.gameElements.cellId));
		});
		thisGame.activeCells = [];
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
	checkCell(cellId) {
		const thisGame = this;
		thisGame.dom.checkedCell = thisGame.dom.board.querySelector(`[data-id="${cellId}"]`);
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
			if (cell >= 0 && cell < 100 && !optionCell.classList.contains(select.styles.active) && !optionCell.classList.contains(select.styles.option)) {
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
}

export default Game;
