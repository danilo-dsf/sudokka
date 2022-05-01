import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface SudokuContainerProps {
  padding: number;
}

interface GameInfoContainerProps {
  padding: number;
}

interface GameInfoWrapperProps {
  justifyContent?: string;
}

interface GameInfoTextProps {
  marginLeft?: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};

  justify-content: center;
  align-items: center;
`;

export const SudokuContainer = styled.View<SudokuContainerProps>`
  padding: ${({ padding }) => padding}px;

  flex-direction: row;
  flex-wrap: wrap;
`;

export const NumberPad = styled.View`
  width: 100%;
  margin-top: 24px;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

export const GameInfoContainer = styled.View<GameInfoContainerProps>`
  width: 100%;
  padding: ${({ padding }) => RFValue(padding || 0)}px;
  flex-direction: row;
`;

export const GameInfoWrapper = styled.View<GameInfoWrapperProps>`
  flex: 1;
  flex-direction: row;
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-start'};
  align-items: center;
`;

export const GameInfoText = styled.Text<GameInfoTextProps>`
  font-size: ${RFValue(13)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: ${({ marginLeft }) => RFValue(marginLeft || 0)}px;
`;
