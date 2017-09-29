
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  headerWrap: {
    marginTop: 30,
    marginBottom: 40,
  },
  headerText: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 22,
    color: theme.secondaryColor,
  },
  inputs: {
    paddingBottom: 50,
    paddingTop: 25,
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
    width: DEFAULT.FULL_WIDTH - 110,
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
