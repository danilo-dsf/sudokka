import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';

interface NumberPadKeyProps {
  size: number;
}

export const NumberPadKey = styled.TouchableOpacity<NumberPadKeyProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin-top: ${RFValue(8)}px;
  background-color: white;
  border-radius: ${RFValue(8)}px;
  overflow: hidden;
  opacity: ${({ disabled }) => (disabled ? 0.75 : 1)};

  justify-content: center;
  align-items: center;
`;

export const NumberPadKeyText = styled.Text`
  font-size: ${RFValue(20)}px;
  font-family: ${({ theme }) => theme.fonts.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ClearCellButtonBackground = styled(LinearGradient)`
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;
`;
