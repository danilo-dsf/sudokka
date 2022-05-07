import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { darken } from 'polished';

interface TextProps {
  color: 'info' | 'error' | 'success' | 'default';
}

export const Container = styled(LinearGradient)`
  padding: ${RFValue(16)}px ${RFValue(32)}px;
  border-radius: 9999px;

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const TextContainer = styled.View`
  margin-left: ${RFValue(16)}px;
`;

export const Icon = styled(Feather)`
  margin-right: ${RFValue(16)}px;
`;

export const Title = styled.Text<TextProps>`
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.fonts.semibold};
  color: ${({ theme, color }) => darken(0.6, theme.colors[color])};
  text-align: left;
`;

export const SubTitle = styled.Text<TextProps>`
  font-size: ${RFValue(12)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme, color }) => darken(0.4, theme.colors[color])};
  text-align: left;
`;
