import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import uuid from 'react-native-uuid';

import { sudokuGen } from '../../services/sudoku.service.js';

import * as S from './sudoku.styles';

interface SudokuCell {
  row: number;
  column: number;
}

const numberPadKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'X'];

export const SudokuScreen: React.FC = () => {
  const { width: deviceScreenWidth } = useWindowDimensions();
  const deviceScreenWidthTenth = deviceScreenWidth * 0.1;
  const numberPadKeySize = deviceScreenWidth * 0.175;

  const [sudoku, setSudoku] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<SudokuCell>();

  const handleSelectCell = (row: number, column: number) => {
    setSelectedCell({ row, column });
  };

  const handleInsertNumber = (number: number) => {
    if (!selectedCell?.row && !selectedCell?.column) {
      return;
    }

    setSudoku((prevState) => {
      const newSudoku = [...prevState];
      newSudoku[selectedCell.row][selectedCell.column] = number;
      return newSudoku;
    });
  };

  const handleClearCell = () => {
    if (!selectedCell?.row && !selectedCell?.column) {
      return;
    }

    setSudoku((prevState) => {
      const newSudoku = [...prevState];
      newSudoku[selectedCell.row][selectedCell.column] = 0;
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
              isSelected={selectedCell?.row === rowIndex && selectedCell.column === columnIndex}
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
            disabled={!selectedCell?.row && !selectedCell?.column}
            onPress={typeof numberPadKey !== 'string' ? () => handleInsertNumber(numberPadKey) : handleClearCell}
          >
            <S.NumberPadKeyText>{numberPadKey}</S.NumberPadKeyText>
          </S.NumberPadKey>
        ))}
      </S.NumberPad>
    </S.Container>
  );
};
