
import { Platform, StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  onboardImage: {
    width: 400,
    height: Platform.OS === 'android' ? DEFAULT.FULL_HEIGHT - 275 : DEFAULT.FULL_HEIGHT - 250,
  },
  onboardFull: {
    width: DEFAULT.FULL_WIDTH,
    height: DEFAULT.FULL_HEIGHT,
  },
  onboardHalf: {
    width: DEFAULT.FULL_WIDTH,
    height: DEFAULT.FULL_HEIGHT/2,
  },
  headerWrap: {
    paddingVertical: 30,
  },
  onboardingPage: {
    backgroundColor: theme.transparent,
  },
  headerText: {
    paddingHorizontal: 50,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    color: theme.textColor,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  headerTitle: {
    paddingTop: 40,
    paddingHorizontal: 40,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0)',
    color: theme.textColor,
    fontWeight: 'bold',
  },
  imageWrap: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 0 : 20,
    right: 0,
    left: 0,
  },
  skipButtonText: {
    fontSize: 14,
  },
  skipButton: {
    position: 'absolute',
    bottom: 60,
    right: 40,
  },
  loginButtonText: {
    fontSize: 18,
  },
  loginButton: {
    height: 60,
    backgroundColor: theme.primaryColor,
    borderWidth: 0,
    alignItems: 'center',
    borderRadius: 0,
  },
  loginButton2: {
    height: 60,
    backgroundColor: theme.secondaryColor,
    borderWidth: 0,
    alignItems: 'center',
    borderRadius: 0,
  },
  vokeWrap: {
    width: DEFAULT.FULL_WIDTH,
    // paddingTop: 30,
    position: 'absolute',
    bottom: 55,
    right: 0,
    left: 0,
  },
  vokeBot: {
    bottom: -25,
    width: DEFAULT.FULL_WIDTH - 200,
  },
  endButton: {
    alignItems: 'center',
    marginVertical: 50,
    height: 40,
  },
  actionButton: {
    backgroundColor: theme.secondaryColor,
  },
  backgroundWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DEFAULT.FULL_WIDTH,
    height: DEFAULT.FULL_HEIGHT,
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
});
