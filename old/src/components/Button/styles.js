
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

const buttonStyles = {
  backgroundColor: theme.buttonBackgroundColor,
  paddingVertical: 7,
  paddingHorizontal: 20,
  borderRadius: 5,
  alignItems: 'flex-start',
  justifyContent: 'center',
  borderColor: theme.buttonBorderColor,
  borderWidth: theme.buttonBorderWidth,
};

export default StyleSheet.create({
  button: buttonStyles,
  filled: {
    ...buttonStyles,
    backgroundColor: theme.secondaryColor,
    borderWidth: 0,
    alignItems: 'center',
  },
  disabled: {
    ...buttonStyles,
    backgroundColor: theme.secondaryColor,
    borderWidth: 0,
    alignItems: 'center',
    opacity: 0.6,
  },
  buttonText: {
    color: theme.buttonTextColor,
    fontSize: 16,
  },
  icon: {
    color: theme.buttonIconColor,
    fontSize: 24,
    paddingRight: 10,
  },
  transparent: {
    backgroundColor: COLORS.TRANSPARENT,
  },
  textHeader: {
    color: theme.headerTextColor,
  },
  iconHeader: {
    color: theme.headerTextColor,
  },
  imageStyle: {
    // width: 20,
  },
});
