
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
  headerSubText: {
    textAlign: 'center',
    paddingHorizontal: 60,
    fontSize: 15,
  },
  inputs: {
    paddingBottom: 50,
  },
  inputBox: {
    marginTop: 15,
    padding: 10,
    width: DEFAULT.FULL_WIDTH - 110,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 15,
  },
  signInButton: {
    fontSize: 16,
  },
  legalText: {
    fontSize: 14,
    color: theme.secondaryColor,
    paddingHorizontal: 60,
    paddingVertical: 30,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 15,
    alignItems: 'center',
    width: DEFAULT.FULL_WIDTH - 110,
  },
  haveAccountText: {
    textAlign: 'center',
    color: theme.secondaryColor,
  },
  haveAccount: {
    paddingLeft: 10,
  },
  haveAccountButton: {
    fontSize: 14,
  },
});
