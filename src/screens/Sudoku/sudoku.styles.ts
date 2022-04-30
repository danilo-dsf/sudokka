import styled, { css } from 'styled-components/native';

interface SudokuContainerProps {
  paddingHorizontal: number;
}

interface SudokuCellProps {
  size: number;
  isSelected: boolean;
  isHovered: boolean;
}

interface NumberPadKeyPorps {
  size: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: whitesmoke;

  justify-content: center;
  align-items: center;
`;

export const SudokuContainer = styled.View<SudokuContainerProps>`
  width: 100%;
  margin: 0px ${({ paddingHorizontal }) => paddingHorizontal}px;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const SudokuCell = styled.TouchableOpacity<SudokuCellProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: white;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);

  ${({ isHovered }) =>
    isHovered &&
    css`
      background-color: lightgreen;
    `}

  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: lightblue;
    `}

  justify-content: center;
  align-items: center;
`;

export const SudokuCellText = styled.Text`
  font-size: 16px;
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
  font-size: 20px;
`;
