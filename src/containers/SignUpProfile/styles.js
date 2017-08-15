
import { StyleSheet } from 'react-native';
import theme, { DEFAULT, COLORS } from '../../theme';

const IMAGE_SIZE = 100;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  photoIcon: {
    color: COLORS.convert({ color: COLORS.WHITE, alpha: 0.7 }),
  },
  imageSelect: {
    borderWidth: 1,
    backgroundColor: theme.primaryColor,
    borderColor: theme.lightBackgroundColor,
    borderRadius: IMAGE_SIZE / 2,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginBottom: 0,
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
  inputBox: {
    marginTop: 10,
    padding: 10,
    width: DEFAULT.FULL_WIDTH - 110,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 15,
    color: theme.textColor,
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
