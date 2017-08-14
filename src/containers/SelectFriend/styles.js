
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  header: {
    fontSize: 28,
  },
  info: {
    fontSize: 16,
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
    borderRadius: 5,
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
