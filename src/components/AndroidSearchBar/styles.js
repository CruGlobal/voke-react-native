
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.primaryColor,
  },
  input: {
    fontSize: 20,
    color: theme.lightText,
    width: theme.fullWidth - 50,
  },
});
