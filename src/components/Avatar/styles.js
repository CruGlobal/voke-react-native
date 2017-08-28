
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  icon: {
    color: theme.buttonIconColor,
    fontSize: 24,
  },
  textStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.textColor,
    // textAlign: 'center',
    fontSize: 12,
    backgroundColor: COLORS.TRANSPARENT,
  },
  avatar: {
    backgroundColor: theme.accentColor,
  },
});
