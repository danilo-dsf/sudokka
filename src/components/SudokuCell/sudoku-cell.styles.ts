import styled, { css, DefaultTheme } from 'styled-components/native';
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

const sudokuCellCss = ({ size, isHovered, isErrored, isSelected }: SudokuCellProps, theme: DefaultTheme) => css`
  width: ${size}px;
  height: ${size}px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: ${darken(0.2, theme.colors.background)};

  ${isHovered &&
  css`
    background-color: ${theme.colors.cellHover};
  `}

  ${isErrored &&
  css`
    background-color: ${theme.colors.error};
  `}

  ${isSelected &&
  css`
    background-color: ${theme.colors.info};
  `}

  justify-content: center;
  align-items: center;
`;

export const SudokuCellPressable = styled.Pressable<SudokuCellProps>`
  ${({ size, isHovered, isErrored, isSelected, theme }) =>
    sudokuCellCss({ size, isHovered, isErrored, isSelected }, theme)}
`;

export const SudokuCellView = styled.View<SudokuCellProps>`
  ${({ size, isHovered, isErrored, isSelected, theme }) =>
    sudokuCellCss({ size, isHovered, isErrored, isSelected }, theme)}
`;

export const SudokuCellText = styled.Text<SudokuCellTextProps>`
  font-size: ${RFValue(24)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};

  ${({ isHovered, theme }) =>
    isHovered &&
    css`
      color: ${darken(0.5, theme.colors.cellHover)};
      font-family: ${theme.fonts.bold};
    `}

  ${({ isEdited, theme }) =>
    isEdited &&
    css`
      color: ${darken(0.25, theme.colors.info)};
      font-family: ${theme.fonts.bold};
    `}

  ${({ isErrored, theme }) =>
    isErrored &&
    css`
      color: ${darken(0.5, theme.colors.error)};
      font-family: ${theme.fonts.bold};
    `}

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      color: ${darken(0.5, theme.colors.info)};
      font-family: ${theme.fonts.bold};
    `}
`;
