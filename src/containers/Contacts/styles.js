
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightBackgroundColor,
  },
  inputWrap: {
    height: 60,
    backgroundColor: theme.primaryColor,
    padding: 5,
  },
  searchBox: {
    height: 40,
    color: theme.primaryColor,
    backgroundColor: COLORS.convert({ color: COLORS.LIGHT_GREY, lighten: 0.2 }),
    borderRadius: 3,
    fontSize: 15,
  },
});
