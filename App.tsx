import React from 'react';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import AppLoading from 'expo-app-loading';
import { AdMobBanner } from 'expo-ads-admob';
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from '@expo-google-fonts/nunito';

import theme from './src/global/styles/theme.styles';

import { Routes } from './src/routes/app.routes';
import { AppProvider } from './src/hooks/app.hook';

const App = () => {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme.creme}>
        <AppProvider>
          <StatusBar
            style={theme.creme.statusBarStyle as StatusBarStyle}
            backgroundColor={theme.creme.colors.backgroundOffset}
            translucent
          />

          <Routes />
        </AppProvider>

        <AdMobBanner
          style={{ position: 'absolute', bottom: 0 }}
          bannerSize="fullBanner"
          adUnitID={process.env.ADMOB_BANNER_ID_TEST}
          servePersonalizedAds
          onDidFailToReceiveAdWithError={(error) => console.log(JSON.stringify(error))}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
