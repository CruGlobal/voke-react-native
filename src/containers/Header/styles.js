import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';
// import { IS_SMALL_ANDROID } from '../../constants';

// const sideWidth = IS_SMALL_ANDROID ? theme.fullWidth / 4 : theme.fullWidth / 6;
const sideWidth = 75;
const isAndroid = theme.isAndroid;

export default StyleSheet.create({
  header: {
    height: isAndroid ? 56 : 65,
    paddingTop: isAndroid ? 0 : 20,
    alignItems: 'center',
    ...(theme.isIphoneX ? { paddingTop: 30, height: 90 } : {}),
  },
  // TODO: Add shadow (ios) and elevation (android)
  shadow: {
    elevation: 4,
  },
  light: {
    backgroundColor: theme.primaryColor,
  },
  dark: {
    backgroundColor: theme.secondaryColor,
  },
  center: {
    justifyContent: 'center',
    alignItems: isAndroid ? 'flex-start' : 'center',
    paddingLeft: isAndroid ? 2 : 0,
  },
  left: {
    width: sideWidth,
  },
  right: {
    width: sideWidth,
  },
  title: {
    color: COLORS.WHITE,
    fontSize: isAndroid ? 24 : 22,
  },
  // HeaderIcon styles
  headerIcon: {
    backgroundColor: COLORS.TRANSPARENT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerIconSize: {
    fontSize: theme.isAndroid ? 25 : 25,
  },
});
