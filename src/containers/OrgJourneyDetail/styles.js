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
    color: theme.darkText,
  },
  card: {
    paddingVertical: 20,
    shadowOpacity: 0.35,
    backgroundColor: theme.white,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowColor: theme.black,
    shadowRadius: 1,
    elevation: 5,
  },
});
