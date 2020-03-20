import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

const ICON_SIZE = theme.isAndroid ? 24 : 26;

export default StyleSheet.create({
  container: {
    width: theme.isAndroid ? ICON_SIZE + 30 : ICON_SIZE + 10,
    height: theme.isAndroid ? ICON_SIZE + 20 : ICON_SIZE,
    position: 'relative',
    overflow: 'visible',
  },
  badgeWrap: {
    height: 16,
    minWidth: 16,
    backgroundColor: COLORS.YELLOW,
    position: 'absolute',
    top: theme.isAndroid ? 11 : -3,
    right: theme.isAndroid ? 2 : -6,
    padding: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  badge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
});
