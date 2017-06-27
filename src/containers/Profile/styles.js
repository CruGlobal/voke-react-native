
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightBackgroundColor,
  },
  imageWrapper: {
    backgroundColor: theme.primaryColor,
  },
  infoWrapper: {
    backgroundColor: theme.lightBackgroundColor,
  },
  imageSelect: {
    height: 125,
    width: 125,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: theme.lightBackgroundColor,
    backgroundColor: 'black',
  },
  imageCover: {
    position: 'absolute',
    backgroundColor: COLORS.TRANSPARENT,
  },
  imageIcon: {
    color: COLORS.convert({color: COLORS.WHITE, alpha: 0.6}),
  },
});
