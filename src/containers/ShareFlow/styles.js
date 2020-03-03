import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';
import { IS_SMALL_ANDROID } from '../../constants';
const isSmallScreen = IS_SMALL_ANDROID || theme.fullHeight < 600;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  actions: {
    paddingHorizontal: 50,
    paddingBottom: 25,
    paddingTop: 10,
  },
  shareWith: {
    height: 200,
    width: theme.fullWidth,
  },
  inputBox: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 16,
    color: theme.textColor,
  },
  imageLogo: {
    alignSelf: 'flex-end',
  },
  shareButton: {
    marginTop: 7,
    marginBottom: 15,
    width: theme.fullWidth - 110,
  },
  addrButton: {
    marginTop: 10,
    width: theme.fullWidth - 110,
  },
  line: {
    height: 2,
    backgroundColor: theme.accentColor,
  },
  orText: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: theme.accentColor,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.convert({
      color: theme.secondaryColor,
      alpha: 0.9,
      darken: 0.4,
    }),
  },
  overlayImage: {
    position: 'absolute',
    left: 0,
    top: 150,
  },
  shareImage: {
    position: 'absolute',
    left: -40,
    top: 80,
    transform: [{ rotateY: '180deg' }],
  },
  shareBubble: {
    borderRadius: 5,
    backgroundColor: COLORS.OFF_BLUE,
    padding: 15,
    position: 'absolute',
    left: 70,
    top: 30,
  },
  chatBubble: {
    borderRadius: 5,
    backgroundColor: theme.white,
    padding: 25,
    position: 'absolute',
    left: 50,
    top: 65,
    width: theme.fullWidth - 90,
  },
  chatText: {
    color: theme.white,
    fontSize: 16,
    textAlign: 'center',
  },
  chatTriangle: {
    width: 17,
    height: 0,
    marginBottom: 10,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderLeftWidth: 13,
    borderLeftColor: COLORS.OFF_BLUE,
    position: 'absolute',
    bottom: 100,
    left: 70,
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
    maxWidth: 200,
    textAlign: 'center',
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
});
