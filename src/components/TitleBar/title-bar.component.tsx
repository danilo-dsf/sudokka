import React from 'react';
import uuid from 'react-native-uuid';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';

import boxShadowStyles from '../../global/styles/box-shadow.styles';

import * as S from './title-bar.styles';

interface TitleBarButton {
  icon: any;
  onPress: () => void;
}

interface TitleBarProps {
  title: string;
  leftButton: TitleBarButton;
  rightButtons?: TitleBarButton[];
}

export const TitleBar: React.FC<TitleBarProps> = ({ title, leftButton, rightButtons }) => {
  const theme = useTheme();

  return (
    <S.Container style={boxShadowStyles}>
      <S.Button onPress={leftButton.onPress}>
        <Feather name={leftButton.icon} size={24} color={theme.colors.textSecondary} />
      </S.Button>

      <S.Title>{title}</S.Title>

      {!!rightButtons?.length &&
        rightButtons.map((button) => (
          <S.Button key={String(uuid.v4())} onPress={button.onPress}>
            <Feather name={button.icon} size={24} color={theme.colors.textSecondary} />
          </S.Button>
        ))}
    </S.Container>
  );
};
