import React, { useCallback, useEffect, useState } from 'react';
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
  const [erroredCells, setErroredCells] = useState<SudokuCell[]>([]);

  const hoverQuadrantRowAndColumnBasedOnSelectedCell = (row: number, col: number) => {
    const boxStartRow = row - (row % 3);
    const boxStartCol = col - (col % 3);

    const quadrant: SudokuCell[] = [];

    for (let i = boxStartRow; i < boxStartRow + 3; i += 1) {
      for (let j = boxStartCol; j < boxStartCol + 3; j += 1) {
        quadrant.push({ row: i, col: j });
      }
    }

    setHoveredQuadrant(quadrant);
  };

  const handleSelectCell = (row: number, col: number) => {
    setSelectedCell({ row, col });
    hoverQuadrantRowAndColumnBasedOnSelectedCell(row, col);
  };

  const checkInsertErrorInsideQuadrant = (insertedNumber: number): SudokuCell[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const quadrantErrors = hoveredQuadrant.filter((cell) => sudoku[cell.row][cell.col] === insertedNumber);

    return quadrantErrors;
  };

  const checkInsertErrorInsideRow = (insertedNumber: number): SudokuCell[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const rowErrors: SudokuCell[] = [];

    for (let i = 0; i < CONSTANTS.GRID_SIZE; i += 1) {
      if (sudoku[selectedCell.row][i] === insertedNumber) {
        rowErrors.push({ row: selectedCell.row, col: i });
      }
    }

    return rowErrors;
  };

  const checkInsertErrorInsideCol = (insertedNumber: number): SudokuCell[] => {
    if (!selectedCell?.row && !selectedCell?.col) {
      return [];
    }

    const colErrors: SudokuCell[] = [];

    for (let i = 0; i < CONSTANTS.GRID_SIZE; i += 1) {
      if (sudoku[i][selectedCell.col] === insertedNumber) {
        colErrors.push({ row: i, col: selectedCell.col });
      }
    }

    return colErrors;
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

    const quadrantErrors = checkInsertErrorInsideQuadrant(number);
    const rowErrors = checkInsertErrorInsideRow(number);
    const colErrors = checkInsertErrorInsideCol(number);

    if (quadrantErrors.length || rowErrors.length || colErrors.length) {
      setErroredCells([...quadrantErrors, ...rowErrors, ...colErrors, selectedCell]);
    } else {
      setErroredCells([]);
    }
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

  const generateMatriz = useCallback(() => {
    const obj = sudokuGen(29);

    if (!obj?.question) {
      return;
    }

    const generatedSudoku = obj.question;
    setSudoku(generatedSudoku);
  }, []);

  useEffect(() => {
    generateMatriz();
  }, [generateMatriz]);

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
              isErrored={erroredCells.some((cell) => cell.row === rowIndex && cell.col === columnIndex)}
              onPress={() => handleSelectCell(rowIndex, columnIndex)}
            >
              <S.SudokuCellText
                isErrored={erroredCells.some((cell) => cell.row === rowIndex && cell.col === columnIndex)}
              >
                {!number ? '' : number}
              </S.SudokuCellText>
            </S.SudokuCell>
          )),
        )}
      </S.SudokuContainer>

      <S.NumberPad>
        {numberPadKeys.map((numberPadKey) => (
          <S.NumberPadKey
            key={String(uuid.v4())}
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
