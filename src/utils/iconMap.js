// Voke Icons from images
import TO_CHAT from '../assets/newShare.png';
import SELECTED from '../assets/buttonArrow.png';
import NOT_SELECTED from '../assets/buttonArrow.png';
import HOME_DOT from '../assets/buttonArrow.png';
import NOTIFICATION_WHITE from '../assets/notificationBell.png';
import NOTIFICATION_BLUE from '../assets/notificationBellBlue.png';
import SHARE_ARROW from '../assets/buttonArrow.png';
import GROUP from '../assets/withGroup.png';
import FRIEND from '../assets/withFriend.png';
import MYSELF from '../assets/byMyself.png';
import BUTTON_ARROW from '../assets/buttonArrow.png';
import CAMERA from '../assets/camera.png';
import GROUP_DARK from '../assets/groupDark.png';
import BUTTON_ARROW_DARK from '../assets/buttonArrowDark.png';

let iconsMap = {};
const vokeIcons = {
  back_button: true,
  pause: true,
  next_arrow_yellow: true,
  circle_empty: true,
  chat_name_arrow: true,
  next_arrow: true,
  back_arrow: true,
  home: true,
  block_chat: true,
  delete_chat: true,
  kickstarter: true,
  send_message: true,
  search: true,
  play: true,
  facebook: true,
  email: true,
  voke_chat_logo: true,
  heart: true,
  next_button_filled: true,
  close: true,
  adventure: true,
  channel: true,
  video: true,
  menu: true,
  plus: true,
  Chat: true,
};

const vokeImages = {
  'to-chat': TO_CHAT,
  selected: SELECTED,
  'not-selected': NOT_SELECTED,
  'home-dot': HOME_DOT,
  notificationBell: NOTIFICATION_WHITE,
  notificationBellBlue: NOTIFICATION_BLUE,
  shareArrow: SHARE_ARROW,
  byMyself: MYSELF,
  withGroup: GROUP,
  groupDark: GROUP_DARK,
  withFriend: FRIEND,
  buttonArrow: BUTTON_ARROW,
  buttonArrowDark: BUTTON_ARROW_DARK,
  camera: CAMERA,
};

export { iconsMap, vokeIcons, vokeImages };
