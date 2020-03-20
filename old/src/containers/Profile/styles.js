import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

const IMAGE_SIZE = 38;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
    flex: 1,
    padding: 0,
    backgroundColor: theme.lightBackgroundColor,
  },
  imageWrapper: {
    backgroundColor: theme.primaryColor,
  },
  imageSelect: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    backgroundColor: 'black',
  },
  imageCover: {
    position: 'absolute',
    backgroundColor: COLORS.TRANSPARENT,
  },
  imageIcon: {
    color: COLORS.convert({ color: COLORS.WHITE, alpha: 0.6 }),
  },
  inputButton: {
    height: 40,
    backgroundColor: COLORS.TRANSPARENT,
  },
  buttonText: {
    paddingLeft: 10,
    fontSize: 14,
    color: theme.primaryColor,
  },
  changeTitle: {
    fontSize: 16,
    color: COLORS.DARK_GREY,
    padding: 10,
  },
  editText: {
    color: theme.primaryColor,
    fontSize: 14,
  },
  inputRow: {
    padding: 10,
  },
  inputBox: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: COLORS.LIGHTEST_GREY,
    borderRadius: 3,
    fontSize: 14,
    paddingLeft: 10,
  },
  saveButton: {
    borderColor: theme.primaryColor,
  },
  saveButtonText: {
    color: theme.primaryColor,
    fontSize: 12,
  },
  signUpText: {
    marginBottom: 30,
    textAlign: 'center',
    color: theme.darkText,
    fontSize: 16,
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    marginRight: 10,
  },
  row: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  settingsSeparator: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  actionButton: {
    backgroundColor: COLORS.DARK_GREY,
    padding: 0,
    margin: 0,
  },
  link: {
    color: theme.darkText,
    fontSize: 16,
  },
  redText: {
    color: COLORS.RED,
    fontSize: 10,
  },
});
