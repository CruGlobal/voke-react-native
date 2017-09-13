
import { StyleSheet } from 'react-native';
import theme, { DEFAULT, COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  modal: {
    width: DEFAULT.FULL_WIDTH - 100,
    backgroundColor: COLORS.WHITE,
    // height: 250,
    padding: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    color: theme.darkText,
    fontSize: 24,
    textAlign: 'center',
    padding: 10,
  },
  description: {
    color: COLORS.DARK_GREY,
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  showMoreDescription: {
    color: COLORS.DARK_GREY,
    fontSize: 16,
    textAlign: 'left',
    padding: 10,
  },
  button: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.primaryColor,
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 0,
    width: (DEFAULT.FULL_WIDTH - 150)/2,
  },
  button2: {
    height: 50,
    paddingHorizontal: 0,
    width: (DEFAULT.FULL_WIDTH - 150)/2,
    backgroundColor: theme.primaryColor,
    borderWidth: 0,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: theme.primaryColor,
    fontSize: 14,
  },
  buttonText2: {
    color: theme.textColor,
    fontSize: 14,
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
  headerText: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  inputBox: {
    marginTop: 8,
    padding: 10,
    width: DEFAULT.FULL_WIDTH - 110,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 16,
    color: theme.textColor,
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
