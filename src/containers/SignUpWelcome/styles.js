
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
  imageWrapper: {
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
    color: theme.secondaryColor,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  headerTitle: {
    paddingTop: 40,
    textAlign: 'center',
    fontSize: 36,
    backgroundColor: 'rgba(0,0,0,0)',
    color: theme.secondaryColor,
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
});
