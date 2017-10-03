
import { StyleSheet } from 'react-native';
import theme, { COLORS, DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    fontSize: 28,
  },
  info: {
    fontSize: 16,
    padding: 5,
  },
  randomButton: {
    alignItems: 'center',
    backgroundColor: theme.lightBackgroundColor,
    width: DEFAULT.FULL_WIDTH - 120,
    margin: 5,
  },
  randomText: {
    color: theme.primaryColor,
  },
  orSeparatorWrapper: {
    padding: 30,
  },
  orSeparator: {
    // width: DEFAULT.FULL_WIDTH - 80,
    // paddingTop: 30,
    borderBottomWidth: 1,
    borderColor: theme.secondaryColor,
  },
  orText: {
    color: theme.secondaryColor,
    fontSize: 16,
  },
  vokeBubble: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.textColor,
    width: DEFAULT.FULL_WIDTH-120,
  },
  imageWrap: {
    width: DEFAULT.FULL_WIDTH,
  },
  vokeBot: {
    height: 100,
    marginRight: -50,
  },
});
