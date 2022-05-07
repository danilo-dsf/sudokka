import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import * as S from './loading-feedback.styles';

interface LoadingFeedbackProps {
  title?: string;
}

export const LoadingFeedback: React.FC<LoadingFeedbackProps> = ({ title = 'Carregando...' }) => {
  const theme = useTheme();

  return (
    <S.Container start={{ x: 0.1, y: 0.2 }} colors={[theme.colors.backgroundOffset, theme.colors.background]}>
      <S.LogoImage />

      <ActivityIndicator size="small" color={theme.colors.info} />

      <S.Title>{title}</S.Title>
    </S.Container>
  );
};
