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
    paddingTop: isSmallScreen ? 20 : 40,
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
    alignSelf: 'flex-start',
    marginLeft: -50,
    marginTop: -30,
    transform: [{ rotate: '45deg' }],
  },
  signInButtonText: {
    fontSize: 16,
  },
  signInButton: {
    width: theme.fullWidth,
    height: 50,
    borderRadius: 0,
    alignItems: 'center',
    marginTop: 2,
  },
  chatBubble: {
    borderRadius: 5,
    backgroundColor: theme.accentColor,
    padding: 15,
    width: theme.fullWidth - 100,
  },
  chatText: {
    color: theme.white,
    fontSize: 16,
    textAlign: 'center',
  },
  chatTriangle: {
    width: 0,
    height: 20,
    marginTop: -5,
    marginRight: theme.fullWidth - 140,
    borderBottomWidth: 17,
    borderBottomColor: 'transparent',
    borderLeftWidth: 17,
    borderLeftColor: theme.accentColor,
  },
  inputLabel: {
    fontSize: 12,
    color: theme.accentColor,
    marginTop: 15,
  },
  inputLabelExplanation: {
    fontSize: 12,
    color: theme.accentColor,
    marginTop: 15,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});