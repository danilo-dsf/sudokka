import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  width: 100%;
  height: ${RFValue(56)}px;
  background-color: ${({ theme }) => theme.colors.backgroundOffset};
  padding: 0 ${RFValue(16)}px;
  margin-bottom: ${RFValue(24)}px;

  flex-direction: row;
  align-items: center;
`;

export const Button = styled.Pressable.attrs({
  android_ripple: { borderless: true, radius: RFValue(24) },
})``;

export const Title = styled.Text`
  flex: 1;
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-left: ${RFValue(16)}px;
`;
