import { Platform, PixelRatio } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import theme from '../theme';

// Voke Icons from images
import ARROW from '../../images/chat_name_arrow.png';
import DELETE_ICON from '../../images/deleteChatIcon.png';
import BLOCK_ICON from '../../images/blockChatIcon.png';
import UNREAD_ARROW from '../../images/next_arrow_yellow.png';
import READ_ARROW from '../../images/next_arrow.png';
import TO_CHAT from '../../images/to-chat-button.png';
import SELECTED from '../../images/circle-filled.png';
import NOT_SELECTED from '../../images/circle-empty.png';
import THUMB_SLIDER from '../../images/slider_thumb.png';
import PLAY_BUTTON from '../../images/play_button.png';
import PAUSE_BUTTON from '../../images/pause_button.png';
import FULLSCREEN_BUTTON from '../../images/fullscreen_button.png';
import BACK_ICON from '../../images/back-arrow.png';
import FILM_ICON from '../../images/video_icon.png';
import MENU_ICON from '../../images/menu_icon.png';
import KICKSTARTERS from '../../images/kickstarters.png';
import HOME_ICON from '../../images/home_icon.png';
import ADD_VIDEOS_ICON from '../../images/add_video_icon.png';
import ADD_KICKSTARTERS_ICON from '../../images/lightning_icon.png';
import PLUS_ICON from '../../images/plus.png';
import SEARCH_ICON from '../../images/search-icon.png';
import VIDEO_BACK from '../../images/back_button_transparent.png';


const navIconSize = (Platform.OS === 'android') ? PixelRatio.getPixelSizeForLayoutSize(10) : 30;
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
// These icons are all for header navigation icons
const icons = {
  'ios-film-outline': [30],
  'ios-menu-outline': [30],
  'ios-search': [30],
  'ios-home-outline': [30],
  'ios-close': [40],
  'chevron-right': [40],
  'ios-arrow-back': [40],
  'ios-plus-empty': [40],
  'ios-add': [40],
  'android-add': [40],
  'ios-radio-button-on': [20, theme.primaryColor],
  'md-film': [navIconSize, theme.primaryColor],
  'md-add': [navIconSize, theme.primaryColor],
  'md-person-add': [navIconSize, theme.primaryColor],
  'md-close': [navIconSize, theme.primaryColor],
  'md-search': [navIconSize, theme.lightText],
};

let iconsMap = {};
const iconsLoaded = new Promise((resolve) => {
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

const vokeIcons = {
  'arrow': ARROW,
  'delete': DELETE_ICON,
  'block': BLOCK_ICON,
  'read-arrow': READ_ARROW,
  'unread-arrow': UNREAD_ARROW,
  'to-chat': TO_CHAT,
  'selected': SELECTED,
  'not-selected': NOT_SELECTED,
  'thumb': THUMB_SLIDER,
  'play': PLAY_BUTTON,
  'pause': PAUSE_BUTTON,
  'fullscreen': FULLSCREEN_BUTTON,
  'back': BACK_ICON,
  'video-back': VIDEO_BACK,
  'menu': MENU_ICON,
  'film': FILM_ICON,
  'kickstarter': KICKSTARTERS,
  'home': HOME_ICON,
  'add-video': ADD_VIDEOS_ICON,
  'add-kickstarter': ADD_KICKSTARTERS_ICON,
  'plus': PLUS_ICON,
  'search': SEARCH_ICON,
};

export {
  iconsMap,
  iconsLoaded,
  vokeIcons,
};
