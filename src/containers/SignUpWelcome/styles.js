
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
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
  onboardHalf: {
    width: theme.fullWidth,
    height: theme.fullHeight/2,
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
    bottom: theme.isAndroid ? 0 : 20,
    right: 0,
    left: 0,
  },
  skipButton: {
    // backgroundColor: theme.black,
    // borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: theme.fullWidth,
    // paddingTop: 30,
    position: 'absolute',
    bottom: 55,
    right: 0,
    left: 0,
  },
  vokeBot: {
    bottom: -25,
    width: theme.fullWidth - 200,
  },
  endButton: {
    alignItems: 'center',
    marginVertical: 50,
    height: 40,
  },
  buttonWrapper: {
    padding: 5,
  },
  backgroundWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: theme.fullWidth,
    height: theme.fullHeight,
  },
  signInButton: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 2,
    borderColor: theme.white,
  },
  signInText: {
    fontSize: 14,
    color: theme.white,
  },
  actionButton: {
    width: theme.fullWidth - 110,
    height: 40,
    backgroundColor: theme.primaryColor,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haveAccount: {
    paddingTop: 50,
    paddingBottom: 0,
  },
  signIn: {
    fontSize: 14,
    color: theme.white,
    // color: theme.primaryColor,
    paddingRight: 5,
  },
  tagline: {
    lineHeight: 40,
    fontSize: 36,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'right',
  },
  privacy: {
    marginHorizontal: 15,
  },
});
