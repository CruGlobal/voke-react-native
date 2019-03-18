import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

const IMAGE_SIZE = 150;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    alignSelf: 'stretch',
  },
  photoIcon: {
    color: COLORS.convert({ color: COLORS.WHITE, alpha: 0.7 }),
  },
  imageSelect: {
    borderRadius: IMAGE_SIZE / 2,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginBottom: 10,
    backgroundColor: theme.secondaryColor,
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    borderWidth: 1,
    borderColor: theme.lightBackgroundColor,
  },
  inputs: {
    paddingBottom: 50,
  },
  signInButton: {
    width: theme.fullWidth,
    height: 50,
    borderRadius: 0,
    alignItems: 'center',
    marginTop: 2,
  },
  actionButton: {
    alignItems: 'center',
    width: theme.fullWidth - 110,
    marginBottom: 30,
  },
  actionButtonSkip: {
    alignItems: 'center',
    marginBottom: 30,
    width: 60,
  },
  imageLogo: {
    alignSelf: 'flex-end',
    marginRight: -50,
    marginTop: -30,
    transform: [{ rotate: '-20deg' }],
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
    marginTop: -10,
    marginLeft: theme.fullWidth - 140,
    borderBottomWidth: 17,
    borderBottomColor: 'transparent',
    borderRightWidth: 17,
    borderRightColor: theme.accentColor,
  },
});
