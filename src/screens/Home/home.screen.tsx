import React, { useState } from 'react';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';
import { Menu, MenuItem } from 'react-native-material-menu';
import { Feather } from '@expo/vector-icons';

import { RFValue } from 'react-native-responsive-fontsize';
import { HomeScreenRouteProps } from '../../routes/app.routes';

import { SudokuLevelName } from '../../services/sudoku.service';

import CONSTANTS from '../../utils/constants';

import { RulesModal } from '../../modals/Rules/rules.modal';

import { Button } from '../../components/Button/button.component';

import boxShadowStyles from '../../global/styles/box-shadow.styles';

import * as S from './home.styles';
import { SudokuData, useSudokuProgress } from '../../hooks/sudoku-progress.hook';
import { formatDuration } from '../../utils/format-duration';

export const HomeScreen: React.FC<HomeScreenRouteProps> = ({ navigation }) => {
  const theme = useTheme();
  const { sudokuProgress } = useSudokuProgress();

  const [selectedLevel, setSelectedLevel] = useState<SudokuLevelName>('EASY');
  const [showPopUpMenu, setShowPopUpMenu] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const handleSelectLevel = (level: SudokuLevelName) => {
    setSelectedLevel(level);
  };

  const handleContinueSudokuGame = (sudokuData: SudokuData) => {
    navigation.navigate('Sudoku', { sudokuLevelName: selectedLevel, sudokuData });
  };

  const handleInitializeSudokuGame = () => {
    navigation.navigate('Sudoku', { sudokuLevelName: selectedLevel });
  };

  const handleTogglePopUpMenu = () => {
    setShowPopUpMenu((prevState) => !prevState);
  };

  const handleShowRulesModal = () => {
    handleTogglePopUpMenu();
    setShowRulesModal(true);
  };

  const handleCloseRulesModal = () => {
    setShowRulesModal(false);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <S.Container start={{ x: 0.1, y: 0.2 }} colors={[theme.colors.backgroundOffset, theme.colors.background]}>
          <S.TitleBar>
            <Menu
              visible={showPopUpMenu}
              anchor={
                <S.PopUpMenuButton onPress={handleTogglePopUpMenu}>
                  <Feather name="more-vertical" size={24} color={theme.colors.textSecondary} />
                </S.PopUpMenuButton>
              }
              onRequestClose={handleTogglePopUpMenu}
            >
              <MenuItem onPress={handleShowRulesModal}>Regras do Sudoku</MenuItem>
            </Menu>
          </S.TitleBar>

          <S.LogoImage />

          <S.Title>Vamos jogar!</S.Title>

          <S.Subtitle>Selecione o nível de dificuldade e clique no botão abaixo para começar um novo jogo.</S.Subtitle>

          <S.LevelSelectContainer>
            {(Object.keys(CONSTANTS.LEVELS) as SudokuLevelName[]).map((level) => (
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

          {!!sudokuProgress.current && (
            <Button
              style={{ marginBottom: RFValue(8) }}
              title="Continuar"
              subTitle={`${formatDuration(sudokuProgress.duration)} | ${CONSTANTS.LEVELS[sudokuProgress.level].label}`}
              icon="play-circle"
              colorScheme="info"
              onPress={() => handleContinueSudokuGame(sudokuProgress)}
            />
          )}

          <Button
            title={sudokuProgress.current ? 'Novo jogo' : 'Começar'}
            icon="play"
            onPress={handleInitializeSudokuGame}
          />
        </S.Container>
      </SafeAreaView>

      <Modal visible={showRulesModal} onRequestClose={handleCloseRulesModal} animationType="slide">
        <RulesModal onClose={handleCloseRulesModal} />
      </Modal>
    </>
  );
};
