
import { StyleSheet } from 'react-native';
import theme from '../../theme';

module.exports = StyleSheet.create({
  button: {
    backgroundColor: theme.buttonBackgroundColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.buttonTextColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    color: theme.buttonIconColor,
    fontSize: 24,
  },
});
