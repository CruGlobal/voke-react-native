import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: theme.white,
  },
  mainContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: theme.primaryColor,
  },
  series: {
    color: theme.darkText,
    paddingTop: 5,
  },
  description: {
    color: theme.darkText,
    paddingVertical: 15,
  },
  start: {
    fontSize: 18,
    color: theme.white,
    paddingBottom: 10,
  },
  card: {
    paddingVertical: 20,
    backgroundColor: theme.primaryColor,
  },
  button: {
    backgroundColor: theme.orange,
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 25,
  },
  left: {
    marginRight: 1,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  right: {
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
});
