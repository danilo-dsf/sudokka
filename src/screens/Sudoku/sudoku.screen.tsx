import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Text, useWindowDimensions } from 'react-native';
import { useTimer } from 'use-timer';
import uuid from 'react-native-uuid';

import CONSTANTS from '../../utils/constants';

import { sudokuGen, sudokuCheck, SudokuCell, SudokuGrid } from '../../services/sudoku.service';

import * as S from './sudoku.styles';
import { formatDuration } from '../../utils/format-duration';

const numberPadKeys = [...CONSTANTS.NUMBERS, 'X'];

export const SudokuScreen: React.FC = () => {
  const { width: deviceScreenWidth } = useWindowDimensions();
  const deviceScreenWidthTenth = deviceScreenWidth * 0.1;
  const numberPadKeySize = deviceScreenWidth * 0.175;

  const { time: durationInSeconds, start: startTimer, pause: pauseTimer, reset: resetTimer } = useTimer();

  const [sudoku, setSudoku] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<SudokuCell>();
  const [hoveredQuadrant, setHoveredQuadrant] = useState<SudokuCell[]>([]);
  const [erroredCells, setErroredCells] = useState<SudokuCell[]>([]);
  const [isSudokuWon, setIsSudokuWon] = useState(false);

  const appState = useRef(AppState.currentState);

  const hoverQuadrantRowAndColumnBasedOnSelectedCell = (row: number, col: number) => {
    const boxStartRow = row - (row % 3);
    const boxStartCol = col - (col % 3);

    const quadrant: SudokuCell[] = [];

    for (let i = boxStartRow; i < boxStartRow + 3; i += 1) {
      for (let j = boxStartCol; j < boxStartCol + 3; j += 1) {
        quadrant.push({ row: i, col: j });
      }
    }

    setHoveredQuadrant(quadrant);
  };

  const handleSelectCell = (row: number, col: number) => {
    setSelectedCell({ row, col });
    hoverQuadrantRowAndColumnBasedOnSelectedCell(row, col);
  };

  const checkInsertErrorInsideQuadrant = (insertedNumber: number): SudokuCell[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const quadrantErrors = hoveredQuadrant.filter((cell) => sudoku[cell.row][cell.col] === insertedNumber);

    return quadrantErrors;
  };

  const checkInsertErrorInsideRow = (insertedNumber: number): SudokuCell[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const rowErrors: SudokuCell[] = [];

    for (let i = 0; i < CONSTANTS.GRID_SIZE; i += 1) {
      if (sudoku[selectedCell.row][i] === insertedNumber) {
        rowErrors.push({ row: selectedCell.row, col: i });
      }
    }

    return rowErrors;
  };

  const checkInsertErrorInsideCol = (insertedNumber: number): SudokuCell[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const colErrors: SudokuCell[] = [];

    for (let i = 0; i < CONSTANTS.GRID_SIZE; i += 1) {
      if (sudoku[i][selectedCell.col] === insertedNumber) {
        colErrors.push({ row: i, col: selectedCell.col });
      }
    }

    return colErrors;
  };

  const handleInsertNumber = (number: number) => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return;
    }

    if (number === sudoku[selectedCell.row][selectedCell.col]) {
      return;
    }

    setSudoku((prevState) => {
      const newSudoku = [...prevState];
      newSudoku[selectedCell.row][selectedCell.col] = number;
      return newSudoku;
    });

    const quadrantErrors = checkInsertErrorInsideQuadrant(number);
    const rowErrors = checkInsertErrorInsideRow(number);
    const colErrors = checkInsertErrorInsideCol(number);

    if (quadrantErrors.length || rowErrors.length || colErrors.length) {
      setErroredCells([...quadrantErrors, ...rowErrors, ...colErrors, selectedCell]);
    } else {
      setErroredCells([]);
    }
  };

  const handleClearCell = () => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return;
    }

    setSudoku((prevState) => {
      const newSudoku = [...prevState];
      newSudoku[selectedCell.row][selectedCell.col] = 0;
      return newSudoku;
    });

    setErroredCells([]);
  };

  const generateSudoku = useCallback(() => {
    const obj = sudokuGen(CONSTANTS.LEVELS.EASY);

    if (!obj?.question) {
      return;
    }

    const generatedSudoku = obj.question;
    setSudoku(generatedSudoku);
  }, []);

  useEffect(() => {
    generateSudoku();
    startTimer();
  }, [generateSudoku, startTimer]);

  useEffect(() => {
    if (sudoku.length && !erroredCells.length) {
      const isGameWin = sudokuCheck(sudoku);
      setIsSudokuWon(isGameWin);

      if (isGameWin) {
        resetTimer();
      }
    }
  }, [erroredCells.length, resetTimer, sudoku]);

  useEffect(() => {
    const pauseTimerIfInBackground = async (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // background para foreground
        pauseTimer();
      } else {
        // foreground para background
        startTimer();
      }

      appState.current = nextAppState;
    };

    AppState.addEventListener('change', pauseTimerIfInBackground);

    return () => {
      AppState.removeEventListener('change', pauseTimerIfInBackground);
    };
  }, [pauseTimer, startTimer]);

  return (
    <S.Container>
      <Text>{`Tempo: ${formatDuration(durationInSeconds)}`}</Text>

      <S.SudokuContainer paddingHorizontal={deviceScreenWidthTenth / 2}>
        {sudoku.map((row, rowIndex) =>
          row.map((number, columnIndex) => (
            <S.SudokuCell
              key={String(uuid.v4())}
              size={deviceScreenWidthTenth}
              disabled={!!number}
              isSelected={selectedCell?.row === rowIndex && selectedCell.col === columnIndex}
              isHovered={
                hoveredQuadrant.some((cell) => cell.row === rowIndex && cell.col === columnIndex) ||
                rowIndex === selectedCell?.row ||
                columnIndex === selectedCell?.col
              }
              isErrored={erroredCells.some((cell) => cell.row === rowIndex && cell.col === columnIndex)}
              onPress={() => handleSelectCell(rowIndex, columnIndex)}
            >
              <S.SudokuCellText
                isErrored={erroredCells.some((cell) => cell.row === rowIndex && cell.col === columnIndex)}
              >
                {!number ? '' : number}
              </S.SudokuCellText>
            </S.SudokuCell>
          )),
        )}
      </S.SudokuContainer>

      {isSudokuWon && <Text style={{ color: 'green', fontWeight: 'bold', marginTop: 32 }}>VOCÊ GANHOU!</Text>}

      <S.NumberPad>
        {numberPadKeys.map((numberPadKey) => (
          <S.NumberPadKey
            key={String(uuid.v4())}
            size={numberPadKeySize}
            disabled={!selectedCell?.row && !selectedCell?.col}
            onPress={typeof numberPadKey !== 'string' ? () => handleInsertNumber(numberPadKey) : handleClearCell}
          >
            <S.NumberPadKeyText>{numberPadKey}</S.NumberPadKeyText>
          </S.NumberPadKey>
        ))}
      </S.NumberPad>
    </S.Container>
  );
};
