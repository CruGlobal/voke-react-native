import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  input: {
    marginTop: 8,
    padding: 10,
    width: theme.fullWidth - 110,
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
  inputNew: {
    marginTop: 4,
    padding: 5,
    width: theme.fullWidth - 110,
    borderBottomWidth: 1,
    borderBottomColor: theme.accentColor,
    borderRadius: 0,
    fontSize: 20,
    color: theme.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});
