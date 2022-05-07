import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, Text, useWindowDimensions, Modal } from 'react-native';
import { useTimer } from 'use-timer';
import uuid from 'react-native-uuid';
import { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

import { SudokuScreenRouteProps } from '../../routes/app.routes';

import CONSTANTS from '../../utils/constants';
import { formatDuration } from '../../utils/format-duration';

import {
  sudokuGen,
  sudokuCheck,
  SudokuCell as SudokuCellType,
  SudokuGrid,
  SudokuLevel,
} from '../../services/sudoku.service';

import { PauseSudokuModal } from '../../modals/PauseSudoku/pause-sudoku.modal';

import { SudokuCell } from '../../components/SudokuCell/sudoku-cell.component';
import { NumberPadKey } from '../../components/NumberPadKey/number-pad-key.component';
import { LoadingFeedback } from '../../components/LoadingFeedback/loading-feedback.component';

import * as S from './sudoku.styles';
import { TitleBar } from '../../components/TitleBar/title-bar.component';

const numberPadKeys = [...CONSTANTS.NUMBERS, 'X'];

export const SudokuScreen: React.FC<SudokuScreenRouteProps> = ({ navigation, route }) => {
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
  const [isSudokuPaused, setIsSudokuPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleGoBack = () => {
    Alert.alert('Deseja mesmo sair?', 'Seu progresso será perdido.', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sair',
        style: 'default',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  const generateSudoku = useCallback(() => {
    setIsLoading(true);
    const newSudoku = sudokuGen(CONSTANTS.LEVELS[route.params.sudokuLevelName] as SudokuLevel);

    if (!newSudoku?.question) {
      return;
    }

    setSudoku(JSON.parse(JSON.stringify(newSudoku.question)));
    setOriginalSudoku(JSON.parse(JSON.stringify(newSudoku.original)));
  }, [route.params.sudokuLevelName]);

  const handlePauseSudoku = useCallback(() => {
    setIsSudokuPaused(true);
    pauseTimer();
  }, [pauseTimer]);

  const handleResumeSudoku = () => {
    setIsSudokuPaused(false);
    startTimer();
  };

  useEffect(() => {
    generateSudoku();
    startTimer();
    setIsLoading(false);
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
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // foreground para background
        handlePauseSudoku();
      } else {
        // background para foreground
      }

      appState.current = nextAppState;
    };

    AppState.addEventListener('change', pauseTimerIfInBackground);

    return () => {
      AppState.removeEventListener('change', pauseTimerIfInBackground);
    };
  }, [handlePauseSudoku]);

  if (isLoading) {
    return <LoadingFeedback title="Gerando um novo quadro de Sudoku para você..." />;
  }

  return (
    <S.Container>
      <TitleBar
        title="Sudokka"
        leftButton={{ icon: 'arrow-left', onPress: handleGoBack }}
        rightButtons={[{ icon: 'pause', onPress: handlePauseSudoku }]}
      />

      <S.GameInfoContainer padding={sudokuGridRemainingSpace / 2}>
        <S.GameInfoWrapper>
          <S.GameInfoText>{CONSTANTS.LEVELS[route.params.sudokuLevelName].label}</S.GameInfoText>
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

      <Modal visible={isSudokuPaused} animationType="slide">
        <PauseSudokuModal resumeSudokuCallback={handleResumeSudoku} gameDurationUntilNow={durationInSeconds} />
      </Modal>
    </S.Container>
  );
};
