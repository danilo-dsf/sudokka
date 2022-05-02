import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';
import { darken } from 'polished';

import logoImg from '../../../assets/icon.png';

interface LevelSelected {
  isSelected: boolean;
}

export const Container = styled(LinearGradient)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${RFValue(24)}px;

  justify-content: center;
  align-items: center;
`;

export const TitleBar = styled.View`
  width: 100%;
  height: ${RFValue(56)}px;

  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  position: absolute;
  top: 0;
`;

export const PopUpMenuButton = styled.TouchableOpacity`
  height: 100%;

  justify-content: center;
`;

export const LogoImage = styled.Image.attrs({
  source: logoImg,
  resizeMode: 'contain',
})`
  width: ${RFValue(120)}px;
  height: ${RFValue(120)}px;
`;

export const Title = styled.Text`
  font-size: ${RFValue(24)}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => darken(0.2, theme.colors.info)};
  margin-top: ${RFValue(32)}px;
`;

export const Subtitle = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin: ${RFValue(16)}px 0px ${RFValue(40)}px;
`;

export const LevelSelectContainer = styled.View`
  margin-bottom: ${RFValue(40)}px;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const LevelWrapper = styled.TouchableOpacity<LevelSelected>`
  padding: ${RFValue(8)}px ${RFValue(16)}px;
  margin: ${RFValue(4)}px;
  background-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.success : theme.colors.backgroundOffset)};
  border-radius: 9999px;
`;

export const LevelWrapperLabel = styled.Text<LevelSelected>`
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme, isSelected }) => (isSelected ? theme.fonts.bold : theme.fonts.regular)};
  color: ${({ theme, isSelected }) => (isSelected ? darken(0.6, theme.colors.success) : theme.colors.textSecondary)};
`;
