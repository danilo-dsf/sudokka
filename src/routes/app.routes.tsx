import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'styled-components';
import AppLoading from 'expo-app-loading';

import { SudokuLevelName } from '../services/sudoku.service';

import { HomeScreen } from '../screens/Home/home.screen';
import { SudokuScreen } from '../screens/Sudoku/sudoku.screen';
import { SudokuData, useSudokuProgress } from '../hooks/sudoku-progress.hook';

export type AppRoutesParams = {
  Home: undefined;
  Sudoku: {
    sudokuLevelName: SudokuLevelName;
    sudokuData?: SudokuData;
  };
};

export type HomeScreenRouteProps = NativeStackScreenProps<AppRoutesParams, 'Home'>;
export type SudokuScreenRouteProps = NativeStackScreenProps<AppRoutesParams, 'Sudoku'>;

const Stack = createNativeStackNavigator<AppRoutesParams>();

export const Routes: React.FC = () => {
  const theme = useTheme();
  const { isLoadingProgress } = useSudokuProgress();

  if (isLoadingProgress) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Sudoku" component={SudokuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
