// Voke Icons from images
import TO_CHAT from '../../images/newShare.png';
import SELECTED from '../../images/circle-filled.png';
import NOT_SELECTED from '../../images/circle-empty.png';
import HOME_DOT from '../../images/homeBadge.png';
import MARKER_ACTIVE from '../../images/markerActive.png';
import MARKER_INACTIVE from '../../images/markerInactive.png';
import MARKER_COMPLETED from '../../images/markerCompleted.png';
import OPTIONAL_ACTIVE from '../../images/optionalActive.png';
import OPTIONAL_COMPLETED from '../../images/optionalCompleted.png';
import OPTIONAL_INACTIVE from '../../images/optionalInactive.png';

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
  'marker-active': MARKER_ACTIVE,
  'marker-inactive': MARKER_INACTIVE,
  'marker-completed': MARKER_COMPLETED,
  'optional-active': OPTIONAL_ACTIVE,
  'optional-completed': OPTIONAL_COMPLETED,
  'optional-inactive': OPTIONAL_INACTIVE,
};

export { iconsMap, vokeIcons, vokeImages };
