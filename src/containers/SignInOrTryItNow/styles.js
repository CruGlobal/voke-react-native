
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  actions: {
    paddingBottom: 50,
  },
  logoWrapper: {
    width: theme.fullWidth,
  },
  imageWrap: {
    width: theme.fullWidth,
  },
  buttonWrapper: {
    padding: 5,
  },
  headerText: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  imageLogo: {
    height: 50,
  },
  signIn: {
    fontSize: 14,
    color: theme.accentColor,
    // color: theme.primaryColor,
    paddingRight: 5,
  },
  haveAccount: {
    paddingTop: 20,
    paddingBottom: 15,
  },
  signInButton: {
    fontSize: 16,
  },
  signInText: {
    fontSize: 14,
  },
  actionButton: {
    width: theme.fullWidth - 110,
    height: 40,
  },
});