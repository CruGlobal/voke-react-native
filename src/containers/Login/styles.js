
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.darkBackgroundColor,
    // backgroundColor: theme.primaryColor,
  },
  actions: {
    paddingBottom: 50,
  },
  logoWrapper: {
    width: DEFAULT.FULL_WIDTH,
  },
  buttonWrapper: {
    padding: 5,
  },
  headerText: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 15,
  },
  imageLogo: {
    height: 50,
    width: 150,
  },
  signIn: {
    fontSize: 14,
    color: theme.secondaryColor,
    // color: theme.primaryColor,
    paddingRight: 5,
  },
  haveAccount: {
    paddingTop: 20,
  },
  signInButton: {
    fontSize: 14,
  },
  actionButton: {
    width: DEFAULT.FULL_WIDTH - 110,
  },
});
