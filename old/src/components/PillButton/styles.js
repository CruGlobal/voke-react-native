
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  button: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: theme.secondaryColor,
    borderColor: theme.secondaryColor,
    borderWidth: theme.buttonBorderWidth,
  },
  empty: {
    backgroundColor: theme.buttonBackgroundColor,
    borderColor: theme.buttonBorderColor,
    borderWidth: theme.buttonBorderWidth,
  },
  emptyText: {
    color: theme.textColor,
  },
});
