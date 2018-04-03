
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 40,
  },
  list: {
    backgroundColor: COLORS.WHITE,
    width: theme.fullWidth - 50,
    height: theme.fullHeight / 1.55,
    borderRadius: 5,
    marginTop: theme.fullHeight / 6,
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
