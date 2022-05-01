import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Text, useWindowDimensions } from 'react-native';
import { useTimer } from 'use-timer';
import uuid from 'react-native-uuid';
import { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

import CONSTANTS from '../../utils/constants';

import { sudokuGen, sudokuCheck, SudokuCell as SudokuCellType, SudokuGrid } from '../../services/sudoku.service';

import { SudokuCell } from '../../components/SudokuCell/sudoku-cell.component';
import { NumberPadKey } from '../../components/NumberPadKey/number-pad-key.component';

import boxShadowStyles from '../../global/styles/box-shadow.styles';
import * as S from './sudoku.styles';
import { formatDuration } from '../../utils/format-duration';

const numberPadKeys = [...CONSTANTS.NUMBERS, 'X'];

export const SudokuScreen: React.FC = () => {
  const theme = useTheme();

  const { width: deviceScreenWidth } = useWindowDimensions();
  const sudokuCellSize = Math.floor(deviceScreenWidth / 9);
  const sudokuGridRemainingSpace = deviceScreenWidth - sudokuCellSize * 9;
  const numberPadKeySize = deviceScreenWidth * 0.175;

  const { time: durationInSeconds, start: startTimer, pause: pauseTimer, reset: resetTimer } = useTimer();

  const [originalSudoku, setOriginalSudoku] = useState<SudokuGrid>([]);
  const [sudoku, setSudoku] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<SudokuCellType>();
  const [hoveredQuadrant, setHoveredQuadrant] = useState<SudokuCellType[]>([]);
  const [erroredCells, setErroredCells] = useState<SudokuCellType[]>([]);
  const [isSudokuWon, setIsSudokuWon] = useState(false);

  const appState = useRef(AppState.currentState);

  const hoverQuadrantRowAndColumnBasedOnSelectedCell = (row: number, col: number) => {
    const boxStartRow = row - (row % 3);
    const boxStartCol = col - (col % 3);

    const quadrant: SudokuCellType[] = [];

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

  const checkInsertErrorInsideQuadrant = (insertedNumber: number): SudokuCellType[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const quadrantErrors = hoveredQuadrant.filter((cell) => sudoku[cell.row][cell.col] === insertedNumber);

    return quadrantErrors;
  };

  const checkInsertErrorInsideRow = (insertedNumber: number): SudokuCellType[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const rowErrors: SudokuCellType[] = [];

    for (let i = 0; i < CONSTANTS.GRID_SIZE; i += 1) {
      if (sudoku[selectedCell.row][i] === insertedNumber) {
        rowErrors.push({ row: selectedCell.row, col: i });
      }
    }

    return rowErrors;
  };

  const checkInsertErrorInsideCol = (insertedNumber: number): SudokuCellType[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const colErrors: SudokuCellType[] = [];

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
    const newSudoku = sudokuGen(CONSTANTS.LEVELS.EASY);

    if (!newSudoku?.question) {
      return;
    }

    setSudoku(JSON.parse(JSON.stringify(newSudoku.question)));
    setOriginalSudoku(JSON.parse(JSON.stringify(newSudoku.original)));
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
      <S.TitleBar style={boxShadowStyles}>
        <S.BackButton>
          <Feather name="arrow-left" size={24} color={theme.colors.textSecondary} />
        </S.BackButton>

        <S.TitleBarLabel>Sudokka</S.TitleBarLabel>
      </S.TitleBar>

      <S.GameInfoContainer padding={sudokuGridRemainingSpace / 2}>
        <S.GameInfoWrapper>
          <S.GameInfoText>Fácil</S.GameInfoText>
        </S.GameInfoWrapper>

        <S.GameInfoWrapper justifyContent="flex-end">
          <Feather name="clock" size={14} color={theme.colors.textSecondary} />
          <S.GameInfoText marginLeft={4}>{formatDuration(durationInSeconds)}</S.GameInfoText>
        </S.GameInfoWrapper>
      </S.GameInfoContainer>

      <S.SudokuContainer padding={sudokuGridRemainingSpace / 2}>
        {sudoku.map((row, rowIndex) =>
          row.map((number, columnIndex) => (
            <SudokuCell
              key={String(uuid.v4())}
              label={!number ? '' : number.toString()}
              size={sudokuCellSize}
              disabled={!!originalSudoku[rowIndex][columnIndex]}
              isEdited={!originalSudoku[rowIndex][columnIndex]}
              isSelected={selectedCell?.row === rowIndex && selectedCell.col === columnIndex}
              isHovered={
                hoveredQuadrant.some((cell) => cell.row === rowIndex && cell.col === columnIndex) ||
                rowIndex === selectedCell?.row ||
                columnIndex === selectedCell?.col
              }
              isErrored={erroredCells.some((cell) => cell.row === rowIndex && cell.col === columnIndex)}
              onPress={() => handleSelectCell(rowIndex, columnIndex)}
            />
          )),
        )}
      </S.SudokuContainer>

      {isSudokuWon && <Text style={{ color: 'green', fontWeight: 'bold', marginTop: 32 }}>VOCÊ GANHOU!</Text>}

      <S.NumberPad>
        {numberPadKeys.map((numberPadKey) => (
          <NumberPadKey
            key={String(uuid.v4())}
            label={numberPadKey}
            size={numberPadKeySize}
            disabled={!selectedCell?.row && !selectedCell?.col}
            onPress={numberPadKey !== 'X' ? () => handleInsertNumber(Number(numberPadKey)) : handleClearCell}
          />
        ))}
      </S.NumberPad>
    </S.Container>
  );
};
