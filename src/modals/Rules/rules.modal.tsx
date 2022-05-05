import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import boxShadowStyles from '../../global/styles/box-shadow.styles';

import * as S from './rules.styles';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const theme = useTheme();

  return (
    <S.Container>
      <S.TitleBar style={boxShadowStyles}>
        <S.CloseButton onPress={onClose}>
          <Feather name="x" size={24} color={theme.colors.textSecondary} />
        </S.CloseButton>

        <S.TitleBarLabel>Regras do Sudoku</S.TitleBarLabel>
      </S.TitleBar>

      <S.SudokuGameRulesImgContainer>
        <S.SudokuGameRulesImg />
      </S.SudokuGameRulesImgContainer>

      <S.RulesText>
        Um quebra-cabeças de Sudoku começa com uma tabela em que alguns números já estão no lugar, dependendo da
        dificuldade do jogo. Um quebra-cabeças completo é aquele em que cada número de 1 a 9 aparece apenas uma vez em
        cada uma das 9 <S.RulesTextHighlight color="#f39c12">linhas</S.RulesTextHighlight>,{' '}
        <S.RulesTextHighlight color="#e74c3c">colunas</S.RulesTextHighlight> e{' '}
        <S.RulesTextHighlight color="#2ecc71">blocos</S.RulesTextHighlight>.
      </S.RulesText>

      <S.RulesText>Estude a tabela para encontrar os números que podem caber em cada célula.</S.RulesText>
    </S.Container>
  );
};
