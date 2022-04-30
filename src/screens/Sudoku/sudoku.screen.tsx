import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import uuid from 'react-native-uuid';

import CONSTANTS from '../../utils/constants';

import { sudokuGen } from '../../services/sudoku.service.js';

import * as S from './sudoku.styles';

interface SudokuCell {
  row: number;
  col: number;
}

const numberPadKeys = [...CONSTANTS.NUMBERS, 'X'];

export const SudokuScreen: React.FC = () => {
  const { width: deviceScreenWidth } = useWindowDimensions();
  const deviceScreenWidthTenth = deviceScreenWidth * 0.1;
  const numberPadKeySize = deviceScreenWidth * 0.175;

  const [sudoku, setSudoku] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<SudokuCell>();
  const [hoveredQuadrant, setHoveredQuadrant] = useState<SudokuCell[]>([]);

  const hoverQuadrantRowAndColumnBasedOnSelectedCell = () => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return;
    }

    const boxStartRow = selectedCell.row - (selectedCell.row % 3);
    const boxStartCol = selectedCell.col - (selectedCell.col % 3);

    const quadrant: SudokuCell[] = [];

    for (let row = boxStartRow; row < boxStartRow + 3; row += 1) {
      for (let col = boxStartCol; col < boxStartCol + 3; col += 1) {
        quadrant.push({ row, col });
      }
    }

    setHoveredQuadrant(quadrant);
  };

  const handleSelectCell = (row: number, col: number) => {
    setSelectedCell({ row, col });
    hoverQuadrantRowAndColumnBasedOnSelectedCell();
  };

  const handleInsertNumber = (number: number) => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return;
    }

    setSudoku((prevState) => {
      const newSudoku = [...prevState];
      newSudoku[selectedCell.row][selectedCell.col] = number;
      return newSudoku;
    });
  };

  const handleClearCell = () => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return;
    }

    setSudoku((prevState) => {
      const newSudoku = [...prevState];
      newSudoku[selectedCell.row][selectedCell.col] = 0;
      return newSudoku;
    });
  };

  const generateMatriz = () => {
    const obj = sudokuGen(29);

    setSudoku(obj?.question);
  };

  useEffect(() => {
    generateMatriz();
  }, []);

  return (
    <S.Container>
      <S.SudokuContainer paddingHorizontal={deviceScreenWidthTenth / 2}>
        {sudoku.map((row, rowIndex) =>
          row.map((number, columnIndex) => (
            <S.SudokuCell
              key={String(uuid.v4())}
              size={deviceScreenWidthTenth}
              disabled={!!number}
              isSelected={selectedCell?.row === rowIndex && selectedCell.col === columnIndex}
              isHovered={
                hoveredQuadrant.some((cell) => cell.row === rowIndex && cell.col === columnIndex) ||
                rowIndex === selectedCell?.row ||
                columnIndex === selectedCell?.col
              }
              onPress={() => handleSelectCell(rowIndex, columnIndex)}
            >
              <S.SudokuCellText>{!number ? '' : number}</S.SudokuCellText>
            </S.SudokuCell>
          )),
        )}
      </S.SudokuContainer>

      <S.NumberPad>
        {numberPadKeys.map((numberPadKey) => (
          <S.NumberPadKey
            size={numberPadKeySize}
            disabled={!selectedCell?.row && !selectedCell?.col}
            onPress={typeof numberPadKey !== 'string' ? () => handleInsertNumber(numberPadKey) : handleClearCell}
          >
            <S.NumberPadKeyText>{numberPadKey}</S.NumberPadKeyText>
          </S.NumberPadKey>
        ))}
      </S.NumberPad>
    </S.Container>
  );
};
