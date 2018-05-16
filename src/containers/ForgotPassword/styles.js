
import { StyleSheet } from 'react-native';
import theme from '../../theme';
import { IS_SMALL_ANDROID } from '../../constants';
const isSmallScreen = IS_SMALL_ANDROID || theme.fullHeight < 600;

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
    paddingVertical: isSmallScreen ? 10 : 30,
  },
  buttonWrapper: {
    padding: 5,
  },
  description: {
    paddingVertical: 10,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 50,
    textAlign: 'center',
  },
  imageLogo: {
    height: 50,
  },
  signInButtonText: {
    fontSize: 16,
  },
  signInButton: {
    width: theme.fullWidth - 110,
    height: 40,
    alignItems: 'center',
    marginTop: 2,
  },
});
