import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: theme.black,
  },
  icon: {
    color: theme.primaryColor,
  },
  text: {
    fontSize: 14,
    color: theme.white,
    paddingLeft: 10,
  },
  button: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderColor: theme.primaryColor,
  },
  buttonText: {
    fontSize: 14,
  },
});
