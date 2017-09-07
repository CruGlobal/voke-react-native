
import { StyleSheet } from 'react-native';
import theme, { COLORS, DEFAULT }  from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.TRANSPARENT,
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 40,
  },
  list: {
    backgroundColor: COLORS.WHITE,
    width: DEFAULT.FULL_WIDTH - 50,
    height: DEFAULT.FULL_HEIGHT / 1.5,
    borderRadius: 5,
    marginTop: DEFAULT.FULL_HEIGHT / 6,
    marginBottom: 10,
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
  actionButtonText: {
    color: theme.primaryColor,
    fontSize: 20,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 0,
  },
  buttonWrapper: {
    marginTop: 10,
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
  },
  buttonBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.LIGHT_GREY,
  },
});
