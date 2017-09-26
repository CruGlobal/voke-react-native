
import { StyleSheet } from 'react-native';
import theme, { DEFAULT, COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingBottom: 10,
    paddingHorizontal: 40,
  },
  modal: {
    width: DEFAULT.FULL_WIDTH -20,
    height: DEFAULT.FULL_HEIGHT / 2.6,
    backgroundColor: COLORS.LIGHT_WHITE,
    marginTop: DEFAULT.FULL_HEIGHT / 1.8 - 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconWrap: {
    overflow: 'hidden',
    borderRadius: 12,
    width: DEFAULT.FULL_WIDTH / 6.5,
    height: DEFAULT.FULL_WIDTH / 6.5,
  },
  shareAction: {
    paddingHorizontal: 10,
    width: (DEFAULT.FULL_WIDTH - 20) /4,
  },
  iconStyle: {
    width: DEFAULT.FULL_WIDTH / 6.5,
    height: DEFAULT.FULL_WIDTH / 6.5,
  },
  iconText: {
    color: COLORS.CHARCOAL,
    fontSize: 12,
    textAlign: 'center',
  },
  showMoreDescription: {
    color: COLORS.DARK_GREY,
    fontSize: 16,
    textAlign: 'left',
    padding: 10,
  },
  button: {
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 0,
    marginVertical: 10,
    width: DEFAULT.FULL_WIDTH -20,
  },
  buttonText: {
    color: theme.secondaryColor,
    fontSize: 18,
    fontWeight: 'bold',
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
