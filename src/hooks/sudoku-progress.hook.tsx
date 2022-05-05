import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import { SudokuGrid, SudokuLevelName } from '../services/sudoku.service';

interface SudokuData {
  original: SudokuGrid;
  current: SudokuGrid;
  duration: number;
  level: SudokuLevelName;
}

interface SudokuProgressContextData {
  sudokuProgress: SudokuData;
  isLoadingProgress: boolean;
  saveSudokuProgress: (sudokuData: SudokuData) => Promise<void>;
}

const SudokuProgressContext = createContext<SudokuProgressContextData>({} as SudokuProgressContextData);

const SudokuProgressProvider: React.FC = ({ children }) => {
  const [sudokuProgress, setSudokuProgress] = useState({} as SudokuData);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  const saveSudokuProgress = useCallback(async (sudokuData: SudokuData) => {
    try {
      await AsyncStorage.setItem('@Sudokka:sudoku-progress', JSON.stringify(sudokuData));
      setSudokuProgress(sudokuData);
    } catch (error: any) {
      console.log(JSON.stringify(error));

      Alert.alert('Erro', 'Ocorreu um erro ao salvar o progresso do jogo.');
    }
  }, []);

  useEffect(() => {
    const loadSudokuProgress = async () => {
      setIsLoadingProgress(true);

      try {
        const progress = await AsyncStorage.getItem('@Sudokka:sudoku-progress');

        if (progress) {
          setSudokuProgress(JSON.parse(progress));
        }
      } catch (error: any) {
        console.log(JSON.stringify(error));

        Alert.alert('Erro', 'Ocorreu um erro ao recuperar o seu progresso do último jogo.');
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadSudokuProgress();
  }, []);

  const providerValue = useMemo(
    () => ({ sudokuProgress, isLoadingProgress, saveSudokuProgress }),
    [sudokuProgress, isLoadingProgress, saveSudokuProgress],
  );

  return <SudokuProgressContext.Provider value={providerValue}>{children}</SudokuProgressContext.Provider>;
};

function useSudokuProgress(): SudokuProgressContextData {
  const context = useContext(SudokuProgressContext);

  if (!context) {
    throw new Error('useAuth must be used within an SudokuProgressProvider');
  }

  return context;
}

export { SudokuProgressProvider, useSudokuProgress, SudokuData };
