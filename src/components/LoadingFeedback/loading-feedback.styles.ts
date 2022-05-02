import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { darken } from 'polished';

import logoImg from '../../../assets/icon.png';

export const Container = styled(LinearGradient)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};

  justify-content: center;
  align-items: center;
`;

export const LogoImage = styled.Image.attrs({
  source: logoImg,
  resizeMode: 'contain',
})`
  width: ${RFValue(120)}px;
  height: ${RFValue(120)}px;
  margin-bottom: ${RFValue(56)}px;
`;

export const Title = styled.Text`
  max-width: ${RFValue(300)}px;
  font-size: ${RFValue(13)}px;
  font-family: ${({ theme }) => theme.fonts.light};
  color: ${({ theme }) => darken(0.2, theme.colors.textSecondary)};
  text-align: center;
  margin-top: ${RFValue(8)}px;
`;
