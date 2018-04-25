
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.convert({ color: theme.black, alpha: 0.7 }),
  },
  closeButton: {
    backgroundColor: theme.primaryColor,
    width: theme.fullWidth - 100,
  },
  chatBubble: {
    borderRadius: 5,
    backgroundColor: theme.white,
    padding: 25,
    width: theme.fullWidth - 100,
  },
  chatText: {
    color: theme.secondaryColor,
    fontSize: 16,
  },
  chatTriangle: {
    width: 17,
    height: 0,
    marginBottom: 20,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 13,
    borderRightColor: theme.lightBackgroundColor,
  },
});
