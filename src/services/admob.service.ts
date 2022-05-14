import { AdMobInterstitial } from 'expo-ads-admob';

export const showInterstitialAd = async () => {
  const adUnitId = process.env.ADMOB_INTERSTITIAL_ID;

  if (adUnitId) {
    await AdMobInterstitial.setAdUnitID(adUnitId);
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  }
};
