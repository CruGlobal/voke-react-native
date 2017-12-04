
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  channel: {
    height: 140,
    backgroundColor: COLORS.OFF_WHITE,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  infoWrap: {
    paddingRight: 25,
  },
  name: {
    fontSize: 20,
    color: theme.primaryColor,
    fontWeight: 'bold',
  },
  subscribers: {
    fontSize: 14,
    color: theme.darkText,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
  },
  button: {
    paddingVertical: 8,
    borderColor: theme.primaryColor,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: theme.primaryColor,
  },
});
