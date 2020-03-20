import React from 'react';
import Image from '../Image';
import Touchable from '../Touchable';
import TRIBL_ICON from '../../assets/triblIcon.png';
import BACK_ARROW from '../../assets/backArrowIcon.png';
import FILTER from '../../assets/filterIcon.png';
import SEARCH from '../../assets/searchIcon.png';
import CLOSE from '../../assets/crossIcon.png';
import SHUFFLE from '../../assets/shuffleOn.png';
import SHUFFLE_INACTIVE from '../../assets/shuffle.png';
import PREV from '../../assets/prev.png';
import NEXT from '../../assets/next.png';
import PLAY from '../../assets/play.png';
import PAUSE from '../../assets/pause.png';
import REPEAT from '../../assets/repeat.png';
import REPEAT_ALL from '../../assets/repeatAll.png';
import REPEAT_ONE from '../../assets/repeatOne.png';
import FAVORITE from '../../assets/whiteFavIcon.png';
import FAVORITE_FILLED from '../../assets/icon_fave_active.png';
import FAVORITE_INACTIVE from '../../assets/icon_fave_inactive.png';
import SHARE from '../../assets/icon_share_inactive.png';
import MORE from '../../assets/moreOptions.png';
import INFO_ICON from '../../assets/questionIcon.png';
import MUSIC_ICON from '../../assets/musicWhite.png';
import TRIBL_BG from '../../assets/triblIconBg.png';
import TRIBL_LOGO from '../../assets/triblLogo.png';
import { StyleProp, ImageStyle, ViewStyle } from 'react-native';

type IconName =
  | 'tribl'
  | 'favorite'
  | 'favorite_filled'
  | 'favorite_inactive'
  | 'share'
  | 'back_arrow'
  | 'filter'
  | 'close'
  | 'shuffle'
  | 'shuffle_inactive'
  | 'repeat'
  | 'repeat_one'
  | 'repeat_all'
  | 'search'
  | 'more'
  | 'previous'
  | 'next'
  | 'play'
  | 'pause'
  | 'info'
  | 'music'
  | 'tribl_bg'
  | 'tribl_logo';

function getSource(name: IconName) {
  switch (name) {
    case 'tribl':
      return TRIBL_ICON;
    case 'favorite':
      return FAVORITE;
    case 'favorite_filled':
      return FAVORITE_FILLED;
    case 'favorite_inactive':
      return FAVORITE_INACTIVE;
    case 'share':
      return SHARE;
    case 'back_arrow':
      return BACK_ARROW;
    case 'filter':
      return FILTER;
    case 'close':
      return CLOSE;
    case 'shuffle':
      return SHUFFLE;
    case 'shuffle_inactive':
      return SHUFFLE_INACTIVE;
    case 'repeat':
      return REPEAT;
    case 'repeat_one':
      return REPEAT_ONE;
    case 'repeat_all':
      return REPEAT_ALL;
    case 'search':
      return SEARCH;
    case 'more':
      return MORE;
    case 'previous':
      return PREV;
    case 'next':
      return NEXT;
    case 'play':
      return PLAY;
    case 'pause':
      return PAUSE;
    case 'info':
      return INFO_ICON;
    case 'music':
      return MUSIC_ICON;
    case 'tribl_bg':
      return TRIBL_BG;
    case 'tribl_logo':
      return TRIBL_LOGO;
    default:
      return TRIBL_ICON;
  }
}

function Icon({
  name,
  size,
  onPress,
  style,
  containerStyle,
}: {
  name: IconName;
  size?: number;
  onPress?: Function;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  if (onPress) {
    return (
      <Touchable onPress={onPress} style={[containerStyle]}>
        <Image
          resizeMode="contain"
          source={getSource(name)}
          style={[{ width: size || 20, height: size || 20 }, style]}
        />
      </Touchable>
    );
  }
  return (
    <Image resizeMode="contain" source={getSource(name)} style={[{ width: size || 20, height: size || 20 }, style]} />
  );
}

export default Icon;
