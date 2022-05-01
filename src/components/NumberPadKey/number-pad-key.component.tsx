import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { darken } from 'polished';

import boxShadowStyles from '../../global/styles/box-shadow.styles';

import * as S from './number-pad-key.styles';

interface NumberPadKeyProps extends TouchableOpacityProps {
  label: number | string;
  size: number;
}

const NumberPadKey: React.FC<NumberPadKeyProps> = ({ label, disabled, ...rest }) => {
  const theme = useTheme();

  return (
    <S.NumberPadKey disabled={disabled} {...rest} style={boxShadowStyles}>
      {label !== 'X' && <S.NumberPadKeyText>{label}</S.NumberPadKeyText>}

      {label === 'X' && (
        <S.ClearCellButtonBackground
          start={{ x: 0.9, y: 0.8 }}
          colors={[darken(0.1, theme.colors.error), darken(0.2, theme.colors.error)]}
        >
          <Feather name="x" size={24} color={darken(0.6, theme.colors.error)} />
        </S.ClearCellButtonBackground>
      )}
    </S.NumberPadKey>
  );
};

export default NumberPadKey;
