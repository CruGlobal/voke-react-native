
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../theme';

const { width: deviceWidth } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  actions: {
    paddingBottom: 50,
  },
  logoWrapper: {
    width: deviceWidth,
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
    paddingRight: 5,
  },
  haveAccount: {
    paddingTop: 20,
  },
  signInButton: {
    fontSize: 14,
  },
  actionButton: {
    width: deviceWidth - 110,
  },
});
