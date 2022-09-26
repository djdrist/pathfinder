/* eslint-disable no-debugger */
import { select, settings } from '../settings.js';

class Path {
	constructor() {
		const thisPath = this;
		thisPath.getElements();
		thisPath.initBorders();
		thisPath.initActions();
	}
	getElements() {
		const thisPath = this;
		thisPath.dom = {};
		thisPath.dom.board = document.querySelector(select.pathElements.board);
		thisPath.dom.button = document.querySelector(select.pathElements.button);
	}

	initActions() {
		const thisPath = this;
		thisPath.activeCells = [];
		thisPath.dom.board.addEventListener('click', function (event) {
			const buttonState = thisPath.dom.button.innerHTML;
			const cellId = event.target.getAttribute(select.pathElements.cellId);
			thisPath.dom.checkedCell = thisPath.dom.board.querySelector(`[data-id="${cellId}"]`);
			if (buttonState == settings.button.start) {
				thisPath.addCell(cellId);
			} else if (buttonState == settings.button.end) {
				thisPath.selectPoints(cellId);
			}
		});
		thisPath.dom.button.addEventListener('click', function () {
			const buttonState = thisPath.dom.button.innerHTML;
			if (buttonState == settings.button.start) {
				thisPath.dom.button.innerHTML = settings.button.end;
				for (let i = 0; i < settings.path.rows * settings.path.cols; i++) {
					const currentCell = thisPath.dom.board.querySelector(`[data-id="${i}"]`);
					if (currentCell.classList.contains(select.styles.option)) {
						currentCell.classList.remove(select.styles.option);
					}
				}
			}
			if (buttonState == settings.button.end && thisPath.startPoint >= 0 && thisPath.endPoint >= 0) {
				thisPath.dom.button.innerHTML = settings.button.reset;
				thisPath.calcRoute();
			}
			if (buttonState == settings.button.reset) {
				thisPath.resetPath();
				thisPath.dom.button.innerHTML = settings.button.start;
			}
		});
	}
	initBorders() {
		const thisPath = this;
		thisPath.borderLeft = [];
		thisPath.borderRight = [];
		const rows = settings.path.rows;
		const cols = settings.path.cols;
		for (let i = rows - 1; i < rows * cols; i += rows) {
			thisPath.borderRight.push(i);
		}
		for (let i = 0; i < rows * cols; i += cols) {
			thisPath.borderLeft.push(i);
		}
	}

	addCell(cellId) {
		const thisPath = this;
		const checkedCell = thisPath.dom.checkedCell;
		if (thisPath.activeCells.length === 0) {
			checkedCell.classList.add(select.styles.active);
			thisPath.lastCell = cellId;
			thisPath.activeCells.push(cellId);
			thisPath.renderOptions(cellId);
		} else if (checkedCell.classList.contains(select.styles.option)) {
			checkedCell.classList.remove(select.styles.option);
			checkedCell.classList.add(select.styles.active);
			thisPath.lastCell = cellId;
			thisPath.activeCells.push(cellId);
			thisPath.renderOptions(cellId);
		} else if (thisPath.lastCell == cellId && checkedCell.classList.contains(select.styles.active)) {
			checkedCell.classList.remove(select.styles.active);
			thisPath.deleteOptions();
		}
	}
	renderOptions(cellId) {
		const thisPath = this;
		thisPath.lastOptions = [];
		cellId = parseInt(cellId);
		let options = [-settings.path.rows, settings.path.rows];
		if (thisPath.borderRight.includes(cellId)) {
			options.push(-1);
		} else if (thisPath.borderLeft.includes(cellId)) {
			options.push(1);
		} else {
			options.push(-1, 1);
		}
		options.forEach(function (element) {
			const cell = parseInt(cellId) + element;
			const optionCell = thisPath.dom.board.querySelector(`[data-id="${cell}"]`);
			if (
				cell >= 0 &&
				cell < settings.path.rows * settings.path.cols &&
				!optionCell.classList.contains(select.styles.active) &&
				!optionCell.classList.contains(select.styles.option)
			) {
				optionCell.classList.add(select.styles.option);
				thisPath.lastOptions.push(cell);
			}
		});
	}
	deleteOptions() {
		const thisPath = this;
		thisPath.activeCells.pop();
		thisPath.lastOptions.forEach(function (element) {
			const cell = parseInt(element);
			const optionCell = thisPath.dom.board.querySelector(`[data-id="${cell}"]`);
			optionCell.classList.remove(select.styles.option);
		});
		if (thisPath.activeCells.length !== 0) {
			thisPath.dom.checkedCell.classList.add(select.styles.option);
		}
		if (thisPath.lastOptions.length == 0 && thisPath.activeCells.length !== 0) {
			const lastCell = thisPath.dom.board.querySelector(`[data-id="${thisPath.lastCell}"]`);
			lastCell.classList.add(select.styles.option);
		}
	}
	selectPoints(cellId) {
		const thisPath = this;
		if (thisPath.startPoint == undefined && thisPath.activeCells.includes(cellId)) {
			thisPath.startPoint = cellId;
			thisPath.dom.checkedCell.classList.remove(select.styles.active);
			thisPath.dom.checkedCell.classList.add(select.styles.startPoint);
		} else if (thisPath.startPoint >= 0 && thisPath.startPoint != cellId && thisPath.endPoint == undefined && thisPath.activeCells.includes(cellId)) {
			thisPath.endPoint = parseInt(cellId);
			thisPath.dom.checkedCell.classList.remove(select.styles.active);
			thisPath.dom.checkedCell.classList.add(select.styles.endPoint);
		}
	}

	calcRoute() {
		const thisPath = this;
		thisPath.activeCells.splice(thisPath.activeCells.indexOf(thisPath.startPoint), 1);
		thisPath.cells = [];
		thisPath.activeCells.forEach(function (element) {
			thisPath.cells.push(parseInt(element));
		});
		thisPath.pathNumber = 0;
		thisPath.path = {};
		thisPath.path[thisPath.pathNumber] = [];
		thisPath.path[thisPath.pathNumber].push(parseInt(thisPath.startPoint));
		thisPath.initSearch();
		thisPath.clearAndShow();
	}

	initPath(startPoint, pathNumber) {
		const thisPath = this;
		const newPath = thisPath.pathNumber + 1;
		thisPath.path[newPath] = [];
		thisPath.path[pathNumber].forEach(function (element) {
			thisPath.path[newPath].push(element);
		});
		//thisPath.path[newPath].pop();
		thisPath.path[newPath].push(parseInt(startPoint));
		thisPath.pathNumber = thisPath.pathNumber + 1;
	}

	initNextRound() {
		const thisPath = this;
		thisPath.initSearch();
	}

	initSearch() {
		const thisPath = this;
		for (let i = 0; i <= thisPath.pathNumber; i++) {
			let lastElement = thisPath.path[i].length - 1;
			let lastCell = thisPath.path[i][lastElement];
			if (lastCell >= 0) {
				thisPath.findNext(lastCell, i);
			}
		}
		if (thisPath.success != 0) {
			thisPath.initNextRound();
		}
	}
	findNext(point, pathNumber) {
		const thisPath = this;
		let options = [-settings.path.rows, settings.path.rows];
		let nextPoint = [];
		if (thisPath.borderRight.includes(point)) {
			options.push(-1);
		} else if (thisPath.borderLeft.includes(point)) {
			options.push(1);
		} else {
			options.push(-1, 1);
		}
		for (let option of options) {
			const x = point + option;
			if (x == thisPath.endPoint) {
				thisPath.success = 0;
				thisPath.path['success'] = thisPath.path[pathNumber];
				thisPath.path['success'].shift();
				break;
			} else if (x >= 0 && x < settings.path.rows * settings.path.cols && thisPath.cells.includes(x) && !thisPath.path[pathNumber].includes(x)) {
				nextPoint.push(x);
			}
		}
		if (thisPath.success != 0) {
			thisPath.renderRoutes(nextPoint, pathNumber);
		}
	}
	renderRoutes(points, pathNumber) {
		const thisPath = this;
		if (points.length == 0) {
			thisPath.path[pathNumber].push(-100);
		}
		if (points.length == 1) {
			thisPath.path[pathNumber].push(points[0]);
		}
		if (points.length == 2) {
			thisPath.initPath(points[1], pathNumber);
			thisPath.path[pathNumber].push(points[0]);
		}
		if (points.length == 3) {
			thisPath.initPath(points[1], pathNumber);
			thisPath.initPath(points[2], pathNumber);
			thisPath.path[pathNumber].push(points[0]);
		}
	}
	clearAndShow() {
		const thisPath = this;
		thisPath.path['success'].forEach(function (element) {
			const pathCell = thisPath.dom.board.querySelector(`[data-id="${element}"]`);
			pathCell.classList.add(select.styles.path);
		});
		const endCell = thisPath.dom.board.querySelector(`[data-id="${thisPath.endPoint}"]`);
		endCell.classList.remove(select.styles.endPoint);
		endCell.classList.add(select.styles.path);
	}
	resetPath() {
		const thisPath = this;
		thisPath.path['success'].forEach(function (element) {
			const pathCell = thisPath.dom.board.querySelector(`[data-id="${element}"]`);
			pathCell.classList.remove(select.styles.path);
		});
		const startCell = thisPath.dom.board.querySelector(`[data-id="${thisPath.startPoint}"]`);
		const endCell = thisPath.dom.board.querySelector(`[data-id="${thisPath.endPoint}"]`);
		startCell.classList.remove(select.styles.startPoint);
		endCell.classList.remove(select.styles.endPoint);
		thisPath.activeCells = [];
		thisPath.startPoint = undefined;
		thisPath.endPoint = undefined;
		thisPath.success = undefined;
	}
}

export default Path;
