
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
    // fontWeight: isAndroid ? 'bold' : 'normal',
  },
  // HeaderIcon styles
  headerIcon: {
    backgroundColor: COLORS.TRANSPARENT,
    // backgroundColor: COLORS.YELLOW,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconSize: {
    fontSize: theme.isAndroid ? 32 : 36,
  },
});
