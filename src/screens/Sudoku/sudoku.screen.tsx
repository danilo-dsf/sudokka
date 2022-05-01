import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import uuid from 'react-native-uuid';
import { useTheme } from 'styled-components/native';

import CONSTANTS from '../../utils/constants';

import { sudokuGen } from '../../services/sudoku.service.js';

import { SudokuCell } from '../../components/SudokuCell/sudoku-cell.component';

import * as S from './sudoku.styles';
import NumberPadKey from '../../components/NumberPadKey/number-pad-key.component';

interface SudokuCell {
  row: number;
  col: number;
}

const numberPadKeys = [...CONSTANTS.NUMBERS, 'X'];

export const SudokuScreen: React.FC = () => {
  const theme = useTheme();

  const { width: deviceScreenWidth } = useWindowDimensions();
  const sudokuCellSize = Math.floor(deviceScreenWidth / 9);
  const sudokuGridRemainingSpace = deviceScreenWidth - sudokuCellSize * 9;
  const numberPadKeySize = deviceScreenWidth * 0.175;

  const [originalSudoku, setOriginalSudoku] = useState<number[][]>([]);
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

    setErroredCells([]);
  };

  const generateSudoku = useCallback(() => {
    const obj = sudokuGen(29);

    if (!obj?.question) {
      return;
    }

    setSudoku(JSON.parse(JSON.stringify(obj.question)));
    setOriginalSudoku(JSON.parse(JSON.stringify(obj.original)));
  }, []);

  useEffect(() => {
    generateSudoku();
  }, [generateSudoku]);

  return (
    <S.Container>
      <S.SudokuContainer padding={sudokuGridRemainingSpace / 2} style={theme.boxShadow}>
        {sudoku.map((row, rowIndex) =>
          row.map((number, columnIndex) => (
            <SudokuCell
              key={String(uuid.v4())}
              label={!number ? '' : number.toString()}
              size={sudokuCellSize}
              disabled={!!originalSudoku[rowIndex][columnIndex]}
              isEdited={!originalSudoku[rowIndex][columnIndex]}
              isSelected={selectedCell?.row === rowIndex && selectedCell.col === columnIndex}
              isHovered={
                hoveredQuadrant.some((cell) => cell.row === rowIndex && cell.col === columnIndex) ||
                rowIndex === selectedCell?.row ||
                columnIndex === selectedCell?.col
              }
              isErrored={erroredCells.some((cell) => cell.row === rowIndex && cell.col === columnIndex)}
              onPress={() => handleSelectCell(rowIndex, columnIndex)}
            />
          )),
        )}
      </S.SudokuContainer>

      <S.NumberPad>
        {numberPadKeys.map((numberPadKey) => (
          <NumberPadKey
            key={String(uuid.v4())}
            label={numberPadKey}
            size={numberPadKeySize}
            disabled={!selectedCell?.row && !selectedCell?.col}
            onPress={numberPadKey !== 'X' ? () => handleInsertNumber(Number(numberPadKey)) : handleClearCell}
          />
        ))}
      </S.NumberPad>
    </S.Container>
  );
};
