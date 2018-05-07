
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
    paddingHorizontal: 50,
    paddingBottom: 25,
    paddingTop: 10,
  },
  logoWrapper: {
    width: theme.fullWidth,
    paddingVertical: isSmallScreen ? 50 : 100,
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
    width: theme.fullWidth,
    position: 'absolute',
    right: -60,
  },
  shareButton: {
    marginTop: 7,
    marginBottom: 15,
  },
  addrButton: {
    marginTop: 10,
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
    backgroundColor: theme.convert({ color: theme.secondaryColor, alpha: 0.9, darken: 0.4 }),
  },
  overlayImage: {
    position: 'absolute',
    left: 0,
    top: 150,
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
    color: theme.accentColor,
    fontSize: 16,
    textAlign: 'center',
  },
  chatTriangle: {
    width: 17,
    height: 0,
    marginBottom: 10,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 13,
    borderRightColor: theme.lightBackgroundColor,
  },
});
