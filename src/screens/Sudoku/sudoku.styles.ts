import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

interface SudokuContainerProps {
  padding: number;
}

interface NumberPadKeyPorps {
  size: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};

  justify-content: center;
  align-items: center;
`;

export const SudokuContainer = styled.View<SudokuContainerProps>`
  padding: ${({ padding }) => padding}px;
  background-color: ${({ theme }) => theme.colors.backgroundOffset};

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const NumberPad = styled.View`
  width: 100%;
  margin-top: 40px;

  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const NumberPadKey = styled.TouchableOpacity<NumberPadKeyPorps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: white;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);

  justify-content: center;
  align-items: center;
`;

export const NumberPadKeyText = styled.Text`
  font-size: ${RFValue(20)}px;
`;
