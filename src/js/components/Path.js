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
		thisPath.dom.info = document.querySelector(select.pathElements.info);
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
				thisPath.dom.info.innerHTML = settings.info.end;
				for (let i = 0; i < settings.path.rows * settings.path.cols; i++) {
					const currentCell = thisPath.dom.board.querySelector(`[data-id="${i}"]`);
					if (currentCell.classList.contains(select.styles.option)) {
						currentCell.classList.remove(select.styles.option);
					}
				}
			}
			if (buttonState == settings.button.end && thisPath.startPoint >= 0 && thisPath.endPoint >= 0) {
				thisPath.dom.button.innerHTML = settings.button.reset;
				thisPath.dom.info.innerHTML = settings.info.reset;
				thisPath.calcRoute();
				thisPath.clearAndShow();
			}
			if (buttonState == settings.button.reset) {
				thisPath.resetPath();
				thisPath.dom.button.innerHTML = settings.button.start;
				thisPath.dom.info.innerHTML = settings.info.start;
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
		} else if (checkedCell.classList.contains(select.styles.active)) {
			thisPath.removeCell(cellId);
		}
	}
	removeCell(cell) {
		const thisPath = this;
		let canRemove = false;
		let successCounter = 0;
		const checkedCell = thisPath.dom.checkedCell;
		const cells = [];
		thisPath.search = 1;
		//thisPath.activeCells.sort((a, b) => a - b);
		thisPath.activeCells.splice(thisPath.activeCells.indexOf(cell), 1);
		thisPath.activeCells.forEach(function (element) {
			cells.push(parseInt(element));
		});
		thisPath.startPoint = cells[0];
		console.log(thisPath.startPoint);
		cells.splice(0, 1);
		for (let cell of cells) {
			thisPath.success = undefined;
			thisPath.endPoint = cell;
			thisPath.calcRoute();
			if (thisPath.success == 0) {
				successCounter++;
			}
		}
		if (thisPath.activeCells.length - 1 == successCounter) {
			canRemove = true;
		}
		if (canRemove == true) {
			checkedCell.classList.remove(select.styles.active);
			for (let i = 0; i < settings.path.rows * settings.path.cols; i++) {
				const currentCell = thisPath.dom.board.querySelector(`[data-id="${i}"]`);
				if (currentCell.classList.contains(select.styles.option)) {
					currentCell.classList.remove(select.styles.option);
				}
			}
			thisPath.activeCells.forEach(function (cell) {
				thisPath.renderOptions(cell);
			});
			thisPath.startPoint = undefined;
			thisPath.endPoint = undefined;
			thisPath.success = undefined;
		} else if (canRemove == false) {
			thisPath.activeCells.push(cell);
		}
	}
	renderOptions(cellId) {
		const thisPath = this;
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
			}
		});
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
		thisPath.cells = [];
		thisPath.activeCells.forEach(function (element) {
			thisPath.cells.push(parseInt(element));
		});
		thisPath.pathNumber = 0;
		thisPath.path = {};
		thisPath.path[thisPath.pathNumber] = [];
		thisPath.path[thisPath.pathNumber].push(parseInt(thisPath.startPoint));
		thisPath.initSearch();
	}

	initPath(startPoint, pathNumber) {
		const thisPath = this;
		const newPath = thisPath.pathNumber + 1;
		thisPath.path[newPath] = [];
		thisPath.path[pathNumber].forEach(function (element) {
			thisPath.path[newPath].push(element);
		});
		thisPath.path[newPath].pop();
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
			if (thisPath.success == 0) {
				break;
			}
			let lastElement = thisPath.path[i].length - 1;
			let lastCell = parseInt(thisPath.path[i][lastElement]);
			if (lastCell >= 0) {
				thisPath.findNext(lastCell, i);
			}
		}
		if (thisPath.success == 0) {
			return;
		} else {
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
		const optionsArr = options.map((x) => x + point);

		if (optionsArr.includes(thisPath.endPoint)) {
			thisPath.success = 0;
			thisPath.path['success'] = thisPath.path[pathNumber];
			return;
		} else {
			for (let option of optionsArr) {
				if (option >= 0 && option < settings.path.rows * settings.path.cols && thisPath.cells.includes(option) && !thisPath.path[pathNumber].includes(option)) {
					nextPoint.push(option);
				}
			}
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
			thisPath.path[pathNumber].push(points[0]);
			thisPath.initPath(points[1], pathNumber);
		}
		if (points.length == 3) {
			thisPath.path[pathNumber].push(points[0]);
			thisPath.initPath(points[1], pathNumber);
			thisPath.initPath(points[2], pathNumber);
		}
		if (points.length == 4) {
			thisPath.path[pathNumber].push(points[0]);
			thisPath.initPath(points[1], pathNumber);
			thisPath.initPath(points[2], pathNumber);
			thisPath.initPath(points[3], pathNumber);
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
		thisPath.cells.forEach(function (element) {
			const pathCell = thisPath.dom.board.querySelector(`[data-id="${element}"]`);
			pathCell.classList.remove(select.styles.active);
		});
		const startCell = thisPath.dom.board.querySelector(`[data-id="${thisPath.startPoint}"]`);
		const endCell = thisPath.dom.board.querySelector(`[data-id="${thisPath.endPoint}"]`);
		startCell.classList.remove(select.styles.startPoint);
		endCell.classList.remove(select.styles.endPoint);
		endCell.classList.remove(select.styles.path);
		thisPath.activeCells = [];
		thisPath.startPoint = undefined;
		thisPath.endPoint = undefined;
		thisPath.success = undefined;
	}
}

export default Path;
