const VECTOR_ICONS_FONTS_PATH = "./node_modules/react-native-vector-icons/Fonts"
const VECTOR_FONTS = ['TitilliumWeb-Regular.ttf', 'TitilliumWeb-Bold.ttf', 'TitilliumWeb-SemiBold.ttf'] // whichever fonts you want to keep
// const VECTOR_FONTS = ['TitilliumWeb-Regular.ttf', 'TitilliumWeb-Bold.ttf', 'TitilliumWeb-SemiBold.ttf'] // whichever fonts you want to keep
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  dependencies: {
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-video/android-exoplayer',
       },
      },
    },
    // Disable auto linking for `react-native-vector-icons` and link
    // the required fonts manually to avoid duplicate resources issue in iOS.
    "react-native-vector-icons": {
      platforms: {
        ios: null,
        android: null,
      },
      assets: VECTOR_FONTS.map((font) => VECTOR_ICONS_FONTS_PATH + "/" + font),
    },
  },
};