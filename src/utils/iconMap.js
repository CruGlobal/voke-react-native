import { Platform, PixelRatio } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const navIconSize = (Platform.OS === 'android') ? PixelRatio.getPixelSizeForLayoutSize(40) : 40; // eslint-disable-line
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const icons = {
  'ios-film-outline': [30],
  'android-film': [30],
  'ios-menu-outline': [30],
  'ios-search': [30],
  'ios-home-outline': [30],
  'ios-close': [40],
  'chevron-right': [40],
  'chevron-left': [40],
  'ios-add': [40],
  'android-add': [40],
};

const iconsMap = {};
const iconsLoaded = new Promise((resolve, reject) => {
  new Promise.all(
    Object.keys(icons).map(iconName =>
    // IconName--suffix--other-suffix is just the mapping name in iconsMap
      Ionicons.getImageSource(
        iconName.replace(replaceSuffixPattern, ''),
        icons[iconName][0],
        icons[iconName][1]
      ))
  ).then(sources => {
    Object.keys(icons)
      .forEach((iconName, idx) => (iconsMap[iconName] = sources[idx]));
    resolve(true);
  });
});

export {
  iconsMap,
  iconsLoaded,
};
