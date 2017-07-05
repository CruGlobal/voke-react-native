
import { StyleSheet } from 'react-native';
import theme, { COLORS, DEFAULT } from '../../theme';

export default StyleSheet.create({
  controlWrapper: {
    height: 30,
    width: DEFAULT.FULL_WIDTH,
    backgroundColor: COLORS.GREY_FADE,
    position: 'absolute',
    bottom: 0,
  },
  slider: {
    marginRight: 10,
  },
  time: {
    fontSize: 12,
  },
  thumbStyle: {
    height: 5,
  },
  button: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  empty: {
    backgroundColor: theme.buttonBackgroundColor,
    borderColor: theme.buttonBorderColor,
    borderWidth: theme.buttonBorderWidth,
  },
  buttonText: {
    color: theme.primaryColor,
  },
  emptyText: {
    color: theme.textColor,
  },
});
