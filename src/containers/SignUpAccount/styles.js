
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
    fontSize: 12,
    color: theme.accentColor,
    paddingHorizontal: 3,
    textAlign: 'center',
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
  legalLinkText: {
    fontSize: 12,
    color: theme.textColor,
  },
  legalLink: {
    padding: 0,
    margin: 0,
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
