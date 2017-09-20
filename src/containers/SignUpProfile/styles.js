
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

const IMAGE_SIZE = 100;

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
    borderWidth: 1,
    borderColor: theme.lightBackgroundColor,
    borderRadius: IMAGE_SIZE / 2,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginBottom: 10,
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
    fontSize: 16,
  },
  actionButton: {
    alignItems: 'center',
    width: 125,
    marginBottom: 30,
  },
});
