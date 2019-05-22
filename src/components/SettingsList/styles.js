import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    borderBottomColor: COLORS.LIGHT_GREY,
    borderBottomWidth: theme.separatorHeight,
  },
  row: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  link: {
    color: theme.darkText,
    fontSize: 16,
  },
  settingsSeparator: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  actionButton: {
    backgroundColor: COLORS.DARK_GREY,
    padding: 0,
    margin: 0,
  },
});
