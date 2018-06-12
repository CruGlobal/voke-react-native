
import { StyleSheet } from 'react-native';
import theme from '../../theme';

const width = theme.fullWidth - 100;

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.convert({ color: theme.black, alpha: 0.95 }),
  },
  closeButton: {
    backgroundColor: theme.primaryColor,
    width,
    marginBottom: 12,
  },
  close: {
    position: 'absolute',
    top: theme.isIphoneX ? 30 : 10,
    right: 10,
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
  title: {
    color: theme.primaryColor,
    fontSize: 28,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.white,
    fontSize: 16,
    textAlign: 'center',
    width: theme.fullWidth - 100,
    paddingTop: 20,
  },
  chatText: {
    color: theme.accentColor,
    fontSize: 16,
    textAlign: 'center',
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
