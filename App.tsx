import React from 'react';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import { HomeScreen } from './src/screens/Home/home.screen';

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
    <SafeAreaProvider>
      <ThemeProvider theme={theme.creme}>
        <StatusBar
          style={theme.creme.statusBarStyle as StatusBarStyle}
          backgroundColor={theme.creme.colors.backgroundOffset}
          translucent
        />

        <HomeScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
