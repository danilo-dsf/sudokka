import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

import CONSTANTS from '../../utils/constants';

import { Button } from '../../components/Button/button.component';

import boxShadowStyles from '../../global/styles/box-shadow.styles';

import * as S from './home.styles';

type Level = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD' | 'INSANE' | 'INHUMAN';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();

  const [selectedLevel, setSelectedLevel] = useState<Level>('EASY');

  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <S.Container start={{ x: 0.1, y: 0.2 }} colors={[theme.colors.backgroundOffset, theme.colors.background]}>
        <S.LogoImage />

        <S.Title>Vamos jogar!</S.Title>

        <S.Subtitle>Selecione o nível de dificuldade e clique no botão abaixo para começar um novo jogo.</S.Subtitle>

        <S.LevelSelectContainer>
          {(Object.keys(CONSTANTS.LEVELS) as Level[]).map((level) => (
            <S.LevelWrapper
              key={level}
              isSelected={selectedLevel === level}
              style={boxShadowStyles}
              onPress={() => handleSelectLevel(level)}
            >
              <S.LevelWrapperLabel isSelected={selectedLevel === level}>
                {CONSTANTS.LEVELS[level].label}
              </S.LevelWrapperLabel>
            </S.LevelWrapper>
          ))}
        </S.LevelSelectContainer>

        <Button title="Começar" icon="play" />
      </S.Container>
    </SafeAreaView>
  );
};
