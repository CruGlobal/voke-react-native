import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  inputs: {
    paddingBottom: 10,
    paddingTop: 20,
  },
  signInButton: {
    fontSize: 16,
  },
  legalText: {
    color: theme.accentColor,
    width: theme.fullWidth - 110,
  },
  actionButton: {
    marginTop: 8,
    alignItems: 'center',
    width: theme.fullWidth - 110,
  },
  haveAccountText: {
    textAlign: 'center',
    color: theme.accentColor,
  },
  haveAccount: {
    paddingLeft: 10,
  },
  haveAccountButton: {
    fontSize: 14,
  },
  accountWrap: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 15,
  },
});
