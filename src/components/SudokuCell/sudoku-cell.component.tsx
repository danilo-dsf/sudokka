import React from 'react';
import { PressableProps } from 'react-native';

import * as S from './sudoku-cell.styles';

interface SudokuCellProps extends PressableProps {
  label: string;
  size: number;
  isEdited: boolean;
  isSelected: boolean;
  isHovered: boolean;
  isErrored: boolean;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  label,
  size,
  isEdited,
  isSelected,
  isHovered,
  isErrored,
  disabled,
  ...rest
}) => {
  if (disabled) {
    return (
      <S.SudokuCellView isSelected={isSelected} isHovered={isHovered} isErrored={isErrored} size={size}>
        <S.SudokuCellText isEdited={isEdited} isSelected={isSelected} isHovered={isHovered} isErrored={isErrored}>
          {label}
        </S.SudokuCellText>
      </S.SudokuCellView>
    );
  }

  return (
    <S.SudokuCellPressable isSelected={isSelected} isHovered={isHovered} isErrored={isErrored} size={size} {...rest}>
      <S.SudokuCellText isEdited={isEdited} isSelected={isSelected} isHovered={isHovered} isErrored={isErrored}>
        {label}
      </S.SudokuCellText>
    </S.SudokuCellPressable>
  );
};
