
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
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
  onboardingPage: {
    backgroundColor: theme.transparent,
    flex: 1,
  },
  onboardImage: {
    width: 400,
    height: theme.isAndroid ? theme.fullHeight - 275 : theme.fullHeight - 250,
  },
  onboardFull: {
    width: theme.fullWidth,
    height: theme.fullHeight,
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
    color: theme.white,
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
    color: theme.primaryColor,
  },
  actionButton: {
    width: theme.fullWidth - 110,
    height: 40,
    backgroundColor: theme.primaryColor,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
