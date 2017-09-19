
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  actions: {
    paddingBottom: 50,
  },
  logoWrapper: {
    width: DEFAULT.FULL_WIDTH,
  },
  imageWrap: {
    width: DEFAULT.FULL_WIDTH,
  },
  buttonWrapper: {
    padding: 5,
  },
  description: {
    paddingVertical: 20,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 50,
    textAlign: 'center',
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
  },
  haveAccount: {
    paddingTop: 20,
  },
  signInButtonText: {
    fontSize: 16,
  },
  signInText: {
    fontSize: 14,
  },
  signInButton: {
    width: DEFAULT.FULL_WIDTH - 110,
    height: 40,
    alignItems: 'center',
    marginTop: 2,
  },
  facebookButton: {
    width: DEFAULT.FULL_WIDTH - 110,
    height: 40,
  },
  active: {
    backgroundColor: theme.accentColor,
    borderColor: theme.accentColor,
  },
});
