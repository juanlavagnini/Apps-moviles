/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = 'orange';
const tintColorDark = 'orange';

export const Colors = {
  light: {
    text: '#11181C',
    subTitle: "#666",
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    buttonWithBackground: '#673ab7',
  },
  dark: {
    text: '#ECEDEE',
    subTitle: "#666",
    background: '#000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    buttonWithBackground: '#673ab7',
  },
};
