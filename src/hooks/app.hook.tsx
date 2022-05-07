import React from 'react';

import { SudokuProgressProvider } from './sudoku-progress.hook';

export const AppProvider: React.FC = ({ children }) => {
  return <SudokuProgressProvider>{children}</SudokuProgressProvider>;
};
