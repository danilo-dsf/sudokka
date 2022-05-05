import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'styled-components';

import { SudokuLevelName } from '../services/sudoku.service';

import { HomeScreen } from '../screens/Home/home.screen';
import { SudokuScreen } from '../screens/Sudoku/sudoku.screen';

export type AppRoutesParams = {
  Home: undefined;
  Sudoku: {
    sudokuLevelName: SudokuLevelName;
  };
};

export type HomeScreenRouteProps = NativeStackScreenProps<AppRoutesParams, 'Home'>;
export type SudokuScreenRouteProps = NativeStackScreenProps<AppRoutesParams, 'Sudoku'>;

const Stack = createNativeStackNavigator<AppRoutesParams>();

export const Routes: React.FC = () => {
  const theme = useTheme();

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
