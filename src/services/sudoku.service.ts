/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import CONSTANTS from '../utils/constants';

export type SudokuGrid = number[][];

export interface SudokuCell {
  row: number;
  col: number;
}

export type SudokuLevelName = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD' | 'INSANE' | 'INHUMAN';

export interface SudokuLevel {
  label: SudokuLevelName;
  cellsToFill: number;
}

const newGrid = (size: number) => {
  const arr = new Array(size);

  for (let i = 0; i < size; i += 1) {
    arr[i] = new Array(size);
  }

  for (let i = 0; i < size ** 2; i += 1) {
    arr[Math.floor(i / size)][i % size] = CONSTANTS.UNASSIGNED;
  }

  return arr;
};

// check duplicate number in col
const isColSafe = (grid: SudokuGrid, col: number, value: number) => {
  for (let row = 0; row < CONSTANTS.GRID_SIZE; row += 1) {
    if (grid[row][col] === value) return false;
  }
  return true;
};

// check duplicate number in row
const isRowSafe = (grid: SudokuGrid, row: number, value: number) => {
  for (let col = 0; col < CONSTANTS.GRID_SIZE; col += 1) {
    if (grid[row][col] === value) return false;
  }
  return true;
};

// check duplicate number in 3x3 box
const isBoxSafe = (grid: SudokuGrid, boxRow: number, boxCol: number, value: number) => {
  for (let row = 0; row < CONSTANTS.BOX_SIZE; row += 1) {
    for (let col = 0; col < CONSTANTS.BOX_SIZE; col += 1) {
      if (grid[row + boxRow][col + boxCol] === value) return false;
    }
  }
  return true;
};

// check in row, col and 3x3 box
const isSafe = (grid: SudokuGrid, row: number, col: number, value: number) => {
  return (
    isColSafe(grid, col, value) &&
    isRowSafe(grid, row, value) &&
    isBoxSafe(grid, row - (row % 3), col - (col % 3), value) &&
    value !== CONSTANTS.UNASSIGNED
  );
};

// find unassigned cell
const findUnassignedPos = (grid: SudokuGrid, pos: SudokuCell) => {
  for (let row = 0; row < CONSTANTS.GRID_SIZE; row += 1) {
    for (let col = 0; col < CONSTANTS.GRID_SIZE; col += 1) {
      if (grid[row][col] === CONSTANTS.UNASSIGNED) {
        pos.row = row;
        pos.col = col;
        return true;
      }
    }
  }
  return false;
};

// shuffle arr
const shuffleArray = (arr: number[]) => {
  let currIndex = arr.length;

  while (currIndex !== 0) {
    const randIndex = Math.floor(Math.random() * currIndex);
    currIndex -= 1;

    const temp = arr[currIndex];
    arr[currIndex] = arr[randIndex];
    arr[randIndex] = temp;
  }

  return arr;
};

// check puzzle is complete
const isFullGrid = (grid: SudokuGrid) => {
  return grid.every((row, i) => {
    return row.every((value, j) => {
      return value !== CONSTANTS.UNASSIGNED;
    });
  });
};

const sudokuCreate = (grid: SudokuGrid) => {
  const unassignedPos = {
    row: -1,
    col: -1,
  };

  if (!findUnassignedPos(grid, unassignedPos)) return true;

  const numberList = shuffleArray([...CONSTANTS.NUMBERS]);

  const { row } = unassignedPos;
  const { col } = unassignedPos;

  numberList.forEach((num, i) => {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;

      if (isFullGrid(grid)) {
        return true;
      }
      if (sudokuCreate(grid)) {
        return true;
      }

      grid[row][col] = CONSTANTS.UNASSIGNED;
    }
  });

  return isFullGrid(grid);
};

export const sudokuCheck = (grid: SudokuGrid) => {
  const unassignedPos = {
    row: -1,
    col: -1,
  };

  if (!findUnassignedPos(grid, unassignedPos)) return true;

  grid.forEach((row, i) => {
    row.forEach((num, j) => {
      if (isSafe(grid, i, j, num)) {
        if (isFullGrid(grid)) {
          return true;
        }
        if (sudokuCreate(grid)) {
          return true;
        }
      }
    });
  });

  return isFullGrid(grid);
};

const rand = () => Math.floor(Math.random() * CONSTANTS.GRID_SIZE);

const removeCells = (grid: SudokuGrid, level: number) => {
  const res = [...grid];
  let attemps = level;
  while (attemps > 0) {
    let row = rand();
    let col = rand();
    while (res[row][col] === 0) {
      row = rand();
      col = rand();
    }
    res[row][col] = CONSTANTS.UNASSIGNED;
    attemps -= 1;
  }
  return res;
};

// generate sudoku base on level
export const sudokuGen = (level: SudokuLevel) => {
  const sudoku = newGrid(CONSTANTS.GRID_SIZE);
  const check = sudokuCreate(sudoku);
  if (check) {
    const question = removeCells(sudoku, level.cellsToFill);
    return {
      original: sudoku,
      question,
    };
  }
  return undefined;
};
