
import { StyleSheet } from 'react-native';
import theme from '../../theme';

const width = theme.fullWidth - 100;

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.convert({ color: theme.black, alpha: 0.7 }),
  },
  closeButton: {
    backgroundColor: theme.primaryColor,
    width,
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: theme.transparent,
    width,
    alignItems: 'center',
  },
  chatBubble: {
    borderRadius: 5,
    backgroundColor: theme.white,
    padding: 25,
    width,
  },
  chatText: {
    color: theme.accentColor,
    fontSize: 16,
  },
  chatTriangle: {
    width: 17,
    height: 0,
    marginBottom: 10,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 13,
    borderRightColor: theme.lightBackgroundColor,
  },
});
