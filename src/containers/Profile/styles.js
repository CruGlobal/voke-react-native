
import { StyleSheet } from 'react-native';
import theme, { COLORS, DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
    backgroundColor: theme.lightBackgroundColor,
  },
  imageWrapper: {
    backgroundColor: theme.primaryColor,
  },
  infoWrapper: {
    backgroundColor: theme.lightBackgroundColor,
    padding: 0,
  },
  imageSelect: {
    height: 125,
    width: 125,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: theme.lightBackgroundColor,
    backgroundColor: 'black',
  },
  imageCover: {
    position: 'absolute',
    backgroundColor: COLORS.TRANSPARENT,
  },
  imageIcon: {
    color: COLORS.convert({color: COLORS.WHITE, alpha: 0.6}),
  },
  inputButton: {
    // width: 40,
    height: 40,
    backgroundColor: COLORS.TRANSPARENT,
  },
  buttonText: {
    paddingLeft: 10,
    fontSize: 16,
    color: theme.primaryColor,
  },
  changeTitle: {
    fontSize: 16,
    color: COLORS.DARK_GREY,
    padding: 10,
  },
  editText: {
    color: COLORS.GREY,
    fontSize: 14,
  },
  inputIcon: {
    color: COLORS.GREY,
    fontSize: 20,
  },
  inputRow: {
    padding: 20,
  },
  inputBox: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: COLORS.LIGHTEST_GREY,
    borderRadius: 3,
    fontSize: 14,
    paddingLeft: 10,
    // width: DEFAULT.FULL_WIDTH - 30,
  },
  saveButton: {
    borderColor: theme.primaryColor,
  },
  saveButtonText: {
    color: theme.primaryColor,
  },
});
