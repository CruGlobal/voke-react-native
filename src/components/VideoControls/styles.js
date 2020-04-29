import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';
import videoUtils from '../../utils/video';
import st from '../../st';

const CONTROLLS_HEIGHT = 30;

export default StyleSheet.create({
  controlWrapper: {
    height: CONTROLLS_HEIGHT,
    // width: theme.fullWidth,
    backgroundColor: COLORS.GREY_FADE,
    position: 'absolute',
    bottom: 0,
  },
  outerWrap: {
    // backgroundColor: COLORS.GREY_FADE,
    position: 'absolute',
    bottom: 0,
  },
  slider: {
    marginRight: 10,
  },
  time: {
    fontSize: 12,
  },
  thumbStyle: {
    width: 13,
    height: 13,
  },
  button: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  empty: {
    backgroundColor: theme.buttonBackgroundColor,
    borderColor: theme.buttonBorderColor,
    borderWidth: theme.buttonBorderWidth,
  },
  buttonText: {
    color: theme.primaryColor,
  },
  emptyText: {
    color: theme.textColor,
  },
  viewBlock: {
    // height: videoUtils.HEIGHT,
    // width: videoUtils.WIDTH,
    backgroundColor: COLORS.TRANSPARENT,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  screenPress: {
    // height: videoUtils.HEIGHT,
    // width: videoUtils.WIDTH,
    backgroundColor: COLORS.TRANSPARENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hide: {
    // display: 'none',
  },
  portraitSize: {
    height: videoUtils.HEIGHT,
    width: videoUtils.WIDTH,
  },
  landscapeSize: {
    height: videoUtils.LANDSCAPE_HEIGHT,
    width: st.hasNotch
      ? videoUtils.LANDSCAPE_WIDTH - 80 // top+bottom notches
      : videoUtils.LANDSCAPE_WIDTH,
  },
});