
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

const sideWidth = theme.fullWidth / 6;

export default StyleSheet.create({
  header: {
    height: 65,
    paddingTop: 20,
    // TODO: Add shadow (ios) and elevation (android)
  },
  light: {
    backgroundColor: theme.primaryColor,
  },
  dark: {
    backgroundColor: theme.secondaryColor,
  },
  center: {

  },
  left: {
    width: sideWidth,
  },
  right: {
    width: sideWidth,
  },
  title: {
    color: COLORS.WHITE,
    fontSize: 22,
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
