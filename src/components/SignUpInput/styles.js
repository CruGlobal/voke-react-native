
import { StyleSheet } from 'react-native';
import theme  from '../../theme';

export default StyleSheet.create({
  input: {
    marginTop: 8,
    padding: 10,
    width: theme.fullWidth - 100,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 16,
    color: theme.textColor,
    backgroundColor: 'transparent',
  },
  active: {
    backgroundColor: theme.accentColor,
    borderColor: theme.accentColor,
  },
});
