import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  icon: {
    color: theme.buttonIconColor,
    fontSize: 24,
  },
  rotateVoke: {
    transform: [{ rotate: '25deg' }],
  },
  textStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.textColor,
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: COLORS.TRANSPARENT,
  },
  avatar: {
    backgroundColor: theme.accentColor,
  },
  present: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.GREEN,
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
