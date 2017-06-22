
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightBackgroundColor,
  },
  row: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  link: {
    color: theme.darkText,
    fontSize: 16,
  },
});
