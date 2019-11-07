import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  content: {
    paddingBottom: 70,
    paddingTop: 20,
  },
  title: {
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.accentColor,
    padding: 10,
    width: theme.fullWidth,
  },
});
