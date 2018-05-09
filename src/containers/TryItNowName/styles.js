
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
    paddingBottom: 25,
    paddingTop: 40,
  },
  logoWrapper: {
    width: theme.fullWidth,
    // paddingBottom: isSmallScreen ? 20 : 40,
    paddingTop: 5,
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
  inputBox: {
    marginTop: 8,
    padding: 10,
    width: theme.fullWidth - 110,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 16,
    color: theme.textColor,
  },
  imageLogo: {
    width: theme.fullWidth,
    position: 'absolute',
    right: -150,
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
  chatBubble: {
    borderRadius: 5,
    backgroundColor: theme.white,
    padding: 15,
    width: theme.fullWidth - 100,
  },
  chatText: {
    color: theme.accentColor,
    fontSize: 16,
    textAlign: 'center',
  },
  chatTriangle: {
    width: 17,
    height: 0,
    marginTop: 0,
    marginLeft: theme.fullWidth - 140,
    borderLeftWidth: 16,
    borderLeftColor: 'transparent',
    borderBottomWidth: 13,
    borderBottomColor: theme.lightBackgroundColor,
  },
});
