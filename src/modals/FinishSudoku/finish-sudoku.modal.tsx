import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

import CONSTANTS from '../../utils/constants';
import { SudokuLevelName } from '../../services/sudoku.service';
import { Button } from '../../components/Button/button.component';

import * as S from './finish-sudoku.styles';
import { formatDuration } from '../../utils/format-duration';

interface FinishSudokuModalProps {
  finishGameAndReturnHomeCallback: () => Promise<void>;
  gameDuration: number;
  gameLevel: SudokuLevelName;
}

export const FinishSudokuModal: React.FC<FinishSudokuModalProps> = ({
  finishGameAndReturnHomeCallback,
  gameDuration,
  gameLevel,
}) => {
  const theme = useTheme();

  return (
    <S.Container>
      <StatusBar backgroundColor={theme.colors.success} style="dark" />
      <S.Title>Parabéns!</S.Title>
      <S.SubTitle>Você finalizou o jogo!</S.SubTitle>

      <S.StatisticsContainer>
        <S.Statistic>
          <S.StatisticLabel>Dificuldade</S.StatisticLabel>
          <S.StatisticData>{CONSTANTS.LEVELS[gameLevel].label}</S.StatisticData>
        </S.Statistic>

        <S.Statistic>
          <S.StatisticLabel>Tempo</S.StatisticLabel>
          <S.StatisticData>{formatDuration(gameDuration)}</S.StatisticData>
        </S.Statistic>
      </S.StatisticsContainer>

      <Button
        title="Início"
        icon="home"
        colorScheme="success"
        style={{ position: 'absolute', bottom: RFValue(64) }}
        onPress={finishGameAndReturnHomeCallback}
      />
    </S.Container>
  );
};
