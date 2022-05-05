import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

import sudokuGameRulesImg from '../../../assets/sudoku-rules.png';

interface RulesTextHighlightProps {
  color: string;
}

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const TitleBar = styled.View`
  width: 100%;
  height: ${RFValue(56)}px;
  background-color: ${({ theme }) => theme.colors.backgroundOffset};
  padding: 0 ${RFValue(16)}px;
  margin-bottom: ${RFValue(24)}px;

  flex-direction: row;
  align-items: center;
`;

export const CloseButton = styled.TouchableOpacity`
  height: 100%;

  justify-content: center;
`;

export const TitleBarLabel = styled.Text`
  flex: 1;
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-left: ${RFValue(16)}px;
`;

export const SudokuGameRulesImgContainer = styled.View`
  width: 100%;
  padding: 0px ${RFValue(16)}px;
  margin-bottom: ${RFValue(16)}px;
`;

export const SudokuGameRulesImg = styled.Image.attrs({
  source: sudokuGameRulesImg,
  resizeMode: 'contain',
})`
  width: 100%;
  border-radius: ${RFValue(8)}px;
`;

export const RulesText = styled.Text`
  width: 100%;
  padding: 0px ${RFValue(16)}px;
  font-size: ${RFValue(13)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${RFValue(8)}px;
`;

export const RulesTextHighlight = styled.Text<RulesTextHighlightProps>`
  font-size: ${RFValue(13)}px;
  font-family: ${({ theme }) => theme.fonts.semibold};
  color: ${({ color }) => color};
`;
