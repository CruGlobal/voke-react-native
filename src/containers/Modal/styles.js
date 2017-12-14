
import { StyleSheet } from 'react-native';
import theme, { DEFAULT, COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modal: {
    width: DEFAULT.FULL_WIDTH - 50,
    backgroundColor: COLORS.WHITE,
    // height: 250,
    padding: 0,
    borderRadius: 0,
    overflow: 'hidden',
  },
  title: {
    color: theme.primaryColor,
    fontSize: 24,
    textAlign: 'center',
    padding: 10,
    paddingTop: 20,
    fontWeight: '600',
  },
  titleMore: {
    color: theme.primaryColor,
    fontSize: 24,
    textAlign: 'left',
    paddingHorizontal: 30,
    paddingTop: 20,
    fontWeight: '600',
  },
  permissionImage: {
    marginTop: 40,
  },
  description: {
    color: COLORS.DARK_GREY,
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    paddingBottom: 40,
  },
  showMoreDescription: {
    color: COLORS.DARK_GREY,
    fontSize: 16,
    textAlign: 'left',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  showMoreDescriptionSmall: {
    color: COLORS.DARK_GREY,
    fontSize: 14,
    paddingVertical: 20,
    textAlign: 'left',
    paddingHorizontal: 30,
  },
  button: {
    height: 60,
    borderWidth: 0,
    alignItems: 'center',
    borderRadius: 0,
    paddingHorizontal: 0,
    backgroundColor: theme.accentColor,
    width: (DEFAULT.FULL_WIDTH-50)/2,
  },
  button2: {
    height: 60,
    paddingHorizontal: 0,
    width: (DEFAULT.FULL_WIDTH-50)/2,
    backgroundColor: theme.primaryColor,
    borderWidth: 0,
    alignItems: 'center',
    borderRadius: 0,
  },
  buttonText: {
    color: theme.textColor,
    fontSize: 15,
  },
  buttonText2: {
    color: theme.textColor,
    fontSize: 15,
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
