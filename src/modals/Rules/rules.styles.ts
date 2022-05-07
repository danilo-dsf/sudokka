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
