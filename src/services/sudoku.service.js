import CONSTANTS from '../utils/constants';

export const newGrid = (size) => {
  const arr = new Array(size);

  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size);
  }

  for (let i = 0; i < size ** 2; i++) {
    arr[Math.floor(i / size)][i % size] = CONSTANTS.UNASSIGNED;
  }

  return arr;
};

// check duplicate number in col
export const isColSafe = (grid, col, value) => {
  for (let row = 0; row < CONSTANTS.GRID_SIZE; row++) {
    if (grid[row][col] === value) return false;
  }
  return true;
};

// check duplicate number in row
export const isRowSafe = (grid, row, value) => {
  for (let col = 0; col < CONSTANTS.GRID_SIZE; col++) {
    if (grid[row][col] === value) return false;
  }
  return true;
};

// check duplicate number in 3x3 box
export const isBoxSafe = (grid, box_row, box_col, value) => {
  for (let row = 0; row < CONSTANTS.BOX_SIZE; row++) {
    for (let col = 0; col < CONSTANTS.BOX_SIZE; col++) {
      if (grid[row + box_row][col + box_col] === value) return false;
    }
  }
  return true;
};

// check in row, col and 3x3 box
export const isSafe = (grid, row, col, value) => {
  return (
    isColSafe(grid, col, value) &&
    isRowSafe(grid, row, value) &&
    isBoxSafe(grid, row - (row % 3), col - (col % 3), value) &&
    value !== CONSTANTS.UNASSIGNED
  );
};

// find unassigned cell
export const findUnassignedPos = (grid, pos) => {
  for (let row = 0; row < CONSTANTS.GRID_SIZE; row++) {
    for (let col = 0; col < CONSTANTS.GRID_SIZE; col++) {
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
export const shuffleArray = (arr) => {
  let curr_index = arr.length;

  while (curr_index !== 0) {
    const rand_index = Math.floor(Math.random() * curr_index);
    curr_index -= 1;

    const temp = arr[curr_index];
    arr[curr_index] = arr[rand_index];
    arr[rand_index] = temp;
  }

  return arr;
};

// check puzzle is complete
export const isFullGrid = (grid) => {
  return grid.every((row, i) => {
    return row.every((value, j) => {
      return value !== CONSTANTS.UNASSIGNED;
    });
  });
};

export const sudokuCreate = (grid) => {
  const unassigned_pos = {
    row: -1,
    col: -1,
  };

  if (!findUnassignedPos(grid, unassigned_pos)) return true;

  const number_list = shuffleArray([...CONSTANTS.NUMBERS]);

  const { row } = unassigned_pos;
  const { col } = unassigned_pos;

  number_list.forEach((num, i) => {
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

export const sudokuCheck = (grid) => {
  const unassigned_pos = {
    row: -1,
    col: -1,
  };

  if (!findUnassignedPos(grid, unassigned_pos)) return true;

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

export const rand = () => Math.floor(Math.random() * CONSTANTS.GRID_SIZE);

export const removeCells = (grid, level) => {
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
    attemps--;
  }
  return res;
};

// generate sudoku base on level
export const sudokuGen = (level) => {
  const sudoku = newGrid(CONSTANTS.GRID_SIZE);
  const check = sudokuCreate(sudoku);
  if (check) {
    const question = removeCells(sudoku, level);
    return {
      original: sudoku,
      question,
    };
  }
  return undefined;
};
