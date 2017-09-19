
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.primaryColor,
  },
  input: {
    fontSize: 20,
    color: theme.lightText,
    width: DEFAULT.FULL_WIDTH - 50,
  },
});
