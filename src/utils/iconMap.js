import { PixelRatio } from 'react-native';
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
import HOME_DOT from '../../images/homeBadge.png';
import ONBOARD_FILM from '../../images/onboardFilmIcon.png';
import ONBOARD_CHAT from '../../images/onboardChatIcon.png';
import ONBOARD_HEART from '../../images/onboardHeartIcon.png';
import MARKER_ACTIVE from '../../images/markerActive.png';
import MARKER_INACTIVE from '../../images/markerInactive.png';
import MARKER_COMPLETED from '../../images/markerCompleted.png';
import OPTIONAL_ACTIVE from '../../images/optionalActive.png';
import OPTIONAL_COMPLETED from '../../images/optionalCompleted.png';


// const navIconSize = (theme.isAndroid) ? PixelRatio.getPixelSizeForLayoutSize(10) : 30;
const navIconSize = 30;

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
      Ionicons.getImageSource(
        iconName,
        icons[iconName][0],
        icons[iconName][1]
      ))
  ).then(sources => {
    Object.keys(icons)
      .forEach((iconName, idx) => (iconsMap[iconName] = sources[idx]));
    resolve(true);
  }).catch(() => {
    resolve(false);
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
  'home-dot': HOME_DOT,
  'onboard-film': ONBOARD_FILM,
  'onboard-chat': ONBOARD_CHAT,
  'onboard-heart': ONBOARD_HEART,
  'marker-active': MARKER_ACTIVE,
  'marker-inactive': MARKER_INACTIVE,
  'marker-completed': MARKER_COMPLETED,
  'optional-active': OPTIONAL_ACTIVE,
  'optional-completed': OPTIONAL_COMPLETED,
};

export {
  iconsMap,
  iconsLoaded,
  vokeIcons,
};
