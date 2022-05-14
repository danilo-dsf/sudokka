import { darken, lighten } from 'polished';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.success};
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.black};
  font-size: ${RFValue(40)}px;
  color: ${({ theme }) => darken(0.6, theme.colors.success)};
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.semibold};
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StatisticsContainer = styled.View`
  width: 100%;
  margin-top: ${RFValue(32)}px;

  flex-direction: row;
  justify-content: space-around;
`;

export const Statistic = styled.View`
  flex: 1;

  background-color: ${({ theme }) => lighten(0.1, theme.colors.success)};

  border-radius: ${RFValue(8)}px;

  padding: ${RFValue(16)}px;
  margin: 0px ${RFValue(24)}px;
`;

export const StatisticLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.light};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StatisticData = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(16)}px;
  color: ${({ theme }) => theme.colors.text};
`;
