import styled from 'styled-components/native';

interface SudokuContainerProps {
  padding: number;
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
`;

export const NumberPad = styled.View`
  width: 100%;
  margin-top: 24px;

  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: wrap;
`;
