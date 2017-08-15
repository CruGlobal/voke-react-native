
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
  inputBox: {
    marginTop: 8,
    padding: 10,
    width: DEFAULT.FULL_WIDTH - 110,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 16,
    color: theme.textColor,
  },
  signInButton: {
    fontSize: 16,
  },
  legalText: {
    fontSize: 12,
    color: theme.accentColor,
    paddingHorizontal: 60,
    paddingVertical: 15,
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
  haveAccountButton: {
    fontSize: 14,
  },
  accountWrap: {
    position: 'absolute',
    bottom: 0,
  },
});
