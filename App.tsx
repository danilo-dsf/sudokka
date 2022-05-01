import React from 'react';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import AppLoading from 'expo-app-loading';
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from '@expo-google-fonts/nunito';

import theme from './src/global/styles/theme.styles';

import { SudokuScreen } from './src/screens/Sudoku/sudoku.screen';

const App = () => {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme.creme}>
      <StatusBar
        style={theme.creme.statusBarStyle as StatusBarStyle}
        backgroundColor={theme.creme.colors.background}
        translucent
      />

      <SudokuScreen />
    </ThemeProvider>
  );
};

export default App;
