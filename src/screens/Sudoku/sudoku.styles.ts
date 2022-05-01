import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export const Container = styled(SafeAreaView)`
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

export const BackButton = styled.TouchableOpacity`
  height: 100%;

  justify-content: center;
`;

export const TitleBarLabel = styled.Text`
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-left: ${RFValue(16)}px;
`;

export const SudokuContainer = styled.View<SudokuContainerProps>`
  padding: ${({ padding }) => padding}px;

  flex-direction: row;
  flex-wrap: wrap;
`;

export const NumberPad = styled.View`
  width: 100%;

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
