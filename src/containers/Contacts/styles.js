
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightBackgroundColor,
  },
  randomButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.primaryColor,
    width: DEFAULT.FULL_WIDTH - 120,
    margin: 5,
  },
  randomText: {
    color: theme.primaryColor,
  },
});
