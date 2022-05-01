import 'styled-components';
import theme from '../global/styles/theme.styles';

declare module 'styled-components' {
  type ThemeType = typeof theme.creme;

  export interface DefaultTheme extends ThemeType {}
}
