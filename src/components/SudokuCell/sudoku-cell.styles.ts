import styled, { css } from 'styled-components/native';
import { darken } from 'polished';
import { RFValue } from 'react-native-responsive-fontsize';

interface SudokuCellProps {
  size: number;
  isSelected: boolean;
  isHovered: boolean;
  isErrored: boolean;
}

interface SudokuCellTextProps {
  isEdited: boolean;
  isSelected: boolean;
  isHovered: boolean;
  isErrored: boolean;
}

export const SudokuCell = styled.TouchableOpacity<SudokuCellProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: ${({ theme }) => darken(0.2, theme.colors.background)};

  ${({ isHovered, theme }) =>
    isHovered &&
    css`
      background-color: ${theme.colors.cellHover};
    `}

  ${({ isErrored, theme }) =>
    isErrored &&
    css`
      background-color: ${theme.colors.error};
    `}

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      background-color: ${theme.colors.info};
    `}

  justify-content: center;
  align-items: center;
`;

export const SudokuCellText = styled.Text<SudokuCellTextProps>`
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.text};

  ${({ isHovered, theme }) =>
    isHovered &&
    css`
      color: ${darken(0.5, theme.colors.cellHover)};
      font-weight: bold;
    `}

  ${({ isEdited, theme }) =>
    isEdited &&
    css`
      color: ${darken(0.25, theme.colors.info)};
      font-weight: bold;
    `}

  ${({ isErrored, theme }) =>
    isErrored &&
    css`
      color: ${darken(0.5, theme.colors.error)};
      font-weight: bold;
    `}

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      color: ${darken(0.5, theme.colors.info)};
      font-weight: bold;
    `}
`;
