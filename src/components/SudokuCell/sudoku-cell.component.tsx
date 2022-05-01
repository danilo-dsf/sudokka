import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import * as S from './sudoku-cell.styles';

interface SudokuCellProps extends TouchableOpacityProps {
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
  ...rest
}) => {
  return (
    <S.SudokuCell size={size} isSelected={isSelected} isHovered={isHovered} isErrored={isErrored} {...rest}>
      <S.SudokuCellText isEdited={isEdited} isSelected={isSelected} isHovered={isHovered} isErrored={isErrored}>
        {label}
      </S.SudokuCellText>
    </S.SudokuCell>
  );
};
