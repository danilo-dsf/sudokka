import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  Text,
  useWindowDimensions,
  Modal,
  BackHandler,
  ListRenderItemInfo,
} from 'react-native';
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
  SudokuLevelName,
} from '../../services/sudoku.service';
import { showInterstitialAd } from '../../services/admob.service';

import { PauseSudokuModal } from '../../modals/PauseSudoku/pause-sudoku.modal';
import { FinishSudokuModal } from '../../modals/FinishSudoku/finish-sudoku.modal';

import { SudokuCell } from '../../components/SudokuCell/sudoku-cell.component';
import { NumberPadKey } from '../../components/NumberPadKey/number-pad-key.component';
import { LoadingFeedback } from '../../components/LoadingFeedback/loading-feedback.component';
import { SudokuData, useSudokuProgress } from '../../hooks/sudoku-progress.hook';
import { TitleBar } from '../../components/TitleBar/title-bar.component';

import * as S from './sudoku.styles';

const numberPadKeys = [...CONSTANTS.NUMBERS, 'X'];

export const SudokuScreen: React.FC<SudokuScreenRouteProps> = ({ navigation, route }) => {
  const theme = useTheme();

  const { width: deviceScreenWidth } = useWindowDimensions();
  const sudokuCellSize = Math.floor(deviceScreenWidth / 9);
  const sudokuGridRemainingSpace = deviceScreenWidth - sudokuCellSize * 9;
  const numberPadKeySize = deviceScreenWidth * 0.175;

  const {
    time: durationInSeconds,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useTimer({ initialTime: route.params.sudokuData ? route.params.sudokuData.duration : 0 });
  const { saveSudokuProgress } = useSudokuProgress();

  const appState = useRef(AppState.currentState);

  const [originalSudoku, setOriginalSudoku] = useState<SudokuGrid>([]);
  const [sudoku, setSudoku] = useState<SudokuGrid>([]);
  const [sudokuLevel, setSudokuLevel] = useState<SudokuLevelName>('EASY');
  const [selectedCell, setSelectedCell] = useState<SudokuCellType>({} as SudokuCellType);
  const [hoveredQuadrant, setHoveredQuadrant] = useState<SudokuCellType[]>([]);
  const [erroredCells, setErroredCells] = useState<SudokuCellType[]>([]);
  const [isSudokuWon, setIsSudokuWon] = useState(false);
  const [isSudokuPaused, setIsSudokuPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isNoneCellSelected = useMemo(
    () => !selectedCell || Number.isNaN(Number(selectedCell.row)) || Number.isNaN(Number(selectedCell.col)),
    [selectedCell],
  );

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
    if (isNoneCellSelected) {
      return [];
    }

    const quadrantErrors = hoveredQuadrant.filter((cell) => {
      const isSeletedCell = cell.col === selectedCell.col && cell.row === selectedCell.row;

      return sudoku[cell.row][cell.col] === insertedNumber && !isSeletedCell;
    });

    return quadrantErrors;
  };

  const checkInsertErrorInsideRow = (insertedNumber: number): SudokuCellType[] => {
    if (isNoneCellSelected) {
      return [];
    }

    const rowErrors: SudokuCellType[] = [];

    for (let i = 0; i < CONSTANTS.GRID_SIZE; i += 1) {
      const isSelectedCell = i === selectedCell.col;

      if (sudoku[selectedCell.row][i] === insertedNumber && !isSelectedCell) {
        rowErrors.push({ row: selectedCell.row, col: i });
      }
    }

    return rowErrors;
  };

  const checkInsertErrorInsideCol = (insertedNumber: number): SudokuCellType[] => {
    if (isNoneCellSelected) {
      return [];
    }

    const colErrors: SudokuCellType[] = [];

    for (let i = 0; i < CONSTANTS.GRID_SIZE; i += 1) {
      const isSelectedCell = i === selectedCell.row;

      if (sudoku[i][selectedCell.col] === insertedNumber && !isSelectedCell) {
        colErrors.push({ row: i, col: selectedCell.col });
      }
    }

    return colErrors;
  };

  const handleInsertNumber = (number: number) => {
    if (isNoneCellSelected) {
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
    if (isNoneCellSelected) {
      return;
    }

    setSudoku((prevState) => {
      const newSudoku = [...prevState];
      newSudoku[selectedCell.row][selectedCell.col] = 0;
      return newSudoku;
    });

    setErroredCells([]);
  };

  const handleGoBack = useCallback(() => {
    Alert.alert('Deseja mesmo sair?', 'Seu progresso será salvo e você poderá continuar esse jogo quando quiser.', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sair',
        style: 'default',
        onPress: async () => {
          navigation.goBack();

          const sudokuData: SudokuData = {
            original: originalSudoku,
            current: sudoku,
            duration: durationInSeconds,
            level: sudokuLevel,
          };

          await saveSudokuProgress(sudokuData);
        },
      },
    ]);
  }, [durationInSeconds, navigation, originalSudoku, saveSudokuProgress, sudoku, sudokuLevel]);

  const generateSudoku = useCallback(() => {
    setIsLoading(true);

    if (route.params.sudokuData) {
      setSudoku(route.params.sudokuData.current);
      setOriginalSudoku(route.params.sudokuData.original);
      setSudokuLevel(route.params.sudokuData.level);
    } else {
      const newSudoku = sudokuGen(CONSTANTS.LEVELS[route.params.sudokuLevelName] as SudokuLevel);

      if (!newSudoku?.question) {
        return;
      }

      setSudoku(JSON.parse(JSON.stringify(newSudoku.question)));
      setOriginalSudoku(JSON.parse(JSON.stringify(newSudoku.original)));
      setSudokuLevel(route.params.sudokuLevelName);
    }
  }, [route.params.sudokuData, route.params.sudokuLevelName]);

  const handlePauseSudoku = useCallback(() => {
    setIsSudokuPaused(true);
    pauseTimer();
  }, [pauseTimer]);

  const handleResumeSudoku = async () => {
    await showInterstitialAd();

    setIsSudokuPaused(false);
    startTimer();
  };

  const handleFinishGameAndReturnHome = async () => {
    await showInterstitialAd();

    resetTimer();

    navigation.goBack();
  };

  const renderSudokuRow = ({ item: row, index: rowIndex }: ListRenderItemInfo<number[]>) => (
    <S.SudokuRow>
      {row.map((number, columnIndex) => (
        <SudokuCell
          key={String(uuid.v4())}
          label={!number ? '' : number.toString()}
          size={sudokuCellSize}
          disabled={!!originalSudoku[rowIndex][columnIndex]}
          isEdited={!originalSudoku[rowIndex][columnIndex]}
          isSelected={selectedCell?.row === rowIndex && selectedCell?.col === columnIndex}
          isHovered={
            hoveredQuadrant.some((cell) => cell.row === rowIndex && cell.col === columnIndex) ||
            rowIndex === selectedCell?.row ||
            columnIndex === selectedCell?.col
          }
          isErrored={erroredCells.some((cell) => cell.row === rowIndex && cell.col === columnIndex)}
          onPressIn={() => handleSelectCell(rowIndex, columnIndex)}
        />
      ))}
    </S.SudokuRow>
  );

  useEffect(() => {
    generateSudoku();
    startTimer();
    setIsLoading(false);
  }, [generateSudoku, startTimer]);

  useEffect(() => {
    if (sudoku.length && !erroredCells.length) {
      const isGameWin = sudokuCheck(sudoku);

      if (isGameWin) {
        pauseTimer();

        setTimeout(() => {
          setIsSudokuWon(isGameWin);
        }, 1000);
      }
    }
  }, [erroredCells.length, pauseTimer, sudoku]);

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

  useEffect(() => {
    const handleBackAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackAction);

    return () => backHandler.remove();
  }, [handleGoBack]);

  if (isLoading) {
    const loadingTitle = route.params.sudokuData?.current
      ? 'Carregando seu progesso...'
      : 'Gerando um novo quadro de Sudoku para você...';

    return <LoadingFeedback title={loadingTitle} />;
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
          <S.GameInfoText>{CONSTANTS.LEVELS[sudokuLevel].label}</S.GameInfoText>
        </S.GameInfoWrapper>

        <S.GameInfoWrapper justifyContent="flex-end">
          <Feather name="clock" size={14} color={theme.colors.textSecondary} />
          <S.GameInfoText marginLeft={4}>{formatDuration(durationInSeconds)}</S.GameInfoText>
        </S.GameInfoWrapper>
      </S.GameInfoContainer>

      <S.SudokuContainer
        padding={sudokuGridRemainingSpace / 2}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        data={sudoku}
        keyExtractor={() => String(uuid.v4())}
        renderItem={renderSudokuRow}
        getItemLayout={(_, index) => ({ length: sudokuCellSize, offset: sudokuCellSize * index, index })}
      />

      {isSudokuWon && <Text style={{ color: 'green', fontWeight: 'bold', marginTop: 32 }}>VOCÊ GANHOU!</Text>}

      <S.NumberPad>
        {numberPadKeys.map((numberPadKey) => (
          <NumberPadKey
            key={String(uuid.v4())}
            label={numberPadKey}
            size={numberPadKeySize}
            disabled={isNoneCellSelected}
            onPress={numberPadKey !== 'X' ? () => handleInsertNumber(Number(numberPadKey)) : handleClearCell}
          />
        ))}
      </S.NumberPad>

      <Modal visible={isSudokuPaused} animationType="slide">
        <PauseSudokuModal resumeSudokuCallback={handleResumeSudoku} gameDurationUntilNow={durationInSeconds} />
      </Modal>

      <Modal visible={isSudokuWon} animationType="slide">
        <FinishSudokuModal
          gameDuration={durationInSeconds}
          gameLevel={sudokuLevel}
          finishGameAndReturnHomeCallback={handleFinishGameAndReturnHome}
        />
      </Modal>
    </S.Container>
  );
};
