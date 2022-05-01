import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { darken } from 'polished';

interface TitleProps {
  color: 'info' | 'error' | 'success';
}

export const Container = styled(LinearGradient)`
  padding: ${RFValue(16)}px ${RFValue(32)}px;
  border-radius: 9999px;

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text<TitleProps>`
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.fonts.semibold};
  color: ${({ theme, color }) => darken(0.6, theme.colors[color])};
  margin-left: ${RFValue(16)}px;
`;
