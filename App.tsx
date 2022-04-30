import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { SudokuScreen } from './src/screens/Sudoku/sudoku.screen';

const App = () => {
  return (
    <>
      <StatusBar style="auto" />
      <SudokuScreen />
    </>
  );
};

export default App;
