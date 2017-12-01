
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

const ICON_SIZE = 26;
export default StyleSheet.create({
  container: {
    width: theme.isAndroid ? ICON_SIZE + 30 : ICON_SIZE + 10,
    height: theme.isAndroid ? ICON_SIZE + 15 : ICON_SIZE,
    position: 'relative',
    overflow: 'visible',
  },
  badgeWrap: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.YELLOW,
    position: 'absolute',
    top: -3,
    right: -6,
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
