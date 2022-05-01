import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import { darken } from 'polished';
import { RFValue } from 'react-native-responsive-fontsize';

import * as S from './button.styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: any;
  colorScheme?: 'info' | 'error' | 'success';
}

export const Button: React.FC<ButtonProps> = ({ title, icon, colorScheme = 'info', ...rest }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity {...rest} activeOpacity={0.5}>
      <S.Container
        start={{ x: 0.9, y: 0.8 }}
        colors={[theme.colors[colorScheme], darken(0.1, theme.colors[colorScheme])]}
      >
        {!!icon && <Feather name={icon} size={RFValue(20)} color={darken(0.5, theme.colors[colorScheme])} />}

        <S.Title color={colorScheme}>{title}</S.Title>
      </S.Container>
    </TouchableOpacity>
  );
};
