
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightBackgroundColor,
  },
  row: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  link: {
    color: theme.darkText,
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingsSeparator: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
});
