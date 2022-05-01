import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { darken, transparentize } from 'polished';
import { RFValue } from 'react-native-responsive-fontsize';

import * as S from './pause-sudoku.styles';
import { formatDuration } from '../../utils/format-duration';

interface PauseSudokuModalProps {
  resumeSudokuCallback: () => void;
  gameDurationUntilNow: number;
}

export const PauseSudokuModal: React.FC<PauseSudokuModalProps> = ({
  resumeSudokuCallback,
  gameDurationUntilNow = 0,
}) => {
  const theme = useTheme();

  return (
    <S.Container>
      <Feather name="pause" size={RFValue(80)} color={transparentize(0.5, theme.colors.textSecondary)} />

      <S.Title>Jogo pausado!</S.Title>

      <S.GameDurationContainer>
        <Feather name="clock" size={RFValue(16)} color={theme.colors.textSecondary} />
        <S.GameDurationText>{formatDuration(gameDurationUntilNow)}</S.GameDurationText>
      </S.GameDurationContainer>

      <S.ResumeMessage>Clique abaixo para continuar</S.ResumeMessage>

      <S.ResumeButtonContainer onPress={resumeSudokuCallback}>
        <S.ResumeButton
          start={{ x: 0.9, y: 0.8 }}
          colors={[theme.colors.textSecondary, darken(0.1, theme.colors.textSecondary)]}
        >
          <Feather name="play" size={32} color="#ffffff" />
        </S.ResumeButton>
      </S.ResumeButtonContainer>
    </S.Container>
  );
};
