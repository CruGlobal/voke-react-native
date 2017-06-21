
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightBackgroundColor,
  },
  row: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  link: {
    color: theme.darkText,
    fontSize: 16,
  },
});
