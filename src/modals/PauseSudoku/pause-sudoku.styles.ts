import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundOffset};

  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(24)}px;
  color: ${({ theme }) => theme.colors.text};

  margin-top: ${RFValue(24)}px;
`;

export const ResumeMessage = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(16)}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const GameDurationContainer = styled.View`
  flex-direction: row;
  margin: ${RFValue(16)}px 0px;
  align-items: center;
`;

export const GameDurationText = styled.Text`
  margin-left: ${RFValue(8)}px;

  font-family: ${({ theme }) => theme.fonts.semibold};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ResumeButtonContainer = styled.TouchableOpacity``;

export const ResumeButton = styled(LinearGradient)`
  margin-top: ${RFValue(32)}px;
  padding: ${RFValue(16)}px;

  background-color: ${({ theme }) => theme.colors.textSecondary};

  border-radius: ${RFValue(8)}px;
`;
