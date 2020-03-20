
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  // Sign up styles
  actions: {
    paddingBottom: 50,
  },
  actionButton: {
    width: theme.fullWidth - 110,
    height: 40,
    marginBottom: 10,
  },
  filled: {
    backgroundColor: theme.primaryColor,
    alignItems: 'flex-start',
  },
  signIn: {
    fontSize: 14,
    color: theme.white,
    paddingRight: 5,
  },
  signInFilled: {
    color: theme.darkText,
  },
  signInText: {
    color: theme.accentColor,
    fontSize: 14,
  },
  haveAccount: {
    paddingTop: 5,
  },
});
