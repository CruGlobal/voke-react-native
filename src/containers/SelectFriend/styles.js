
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  header: {
    fontSize: 26,
  },
  info: {
    fontSize: 16,
  },
  vokeBot: {
    position: 'absolute',
    left: 36,
    top: -15,
    borderRadius: 18,
    width: 35,
    height: 35,
    backgroundColor: theme.secondaryColor,
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
});
