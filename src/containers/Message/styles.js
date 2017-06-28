
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  inputWrap: {
    height: 50,
    backgroundColor: theme.secondaryColor,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  chatBox: {
    flex: 1,
    color: theme.textColor,
    backgroundColor: COLORS.convert({ color: theme.primaryColor, alpha: 0.4, lighten: 0.3 }),
    borderRadius: 3,
    fontSize: 15,
  },
  sendIcon: {
    flex: 0.1,
    paddingLeft: 13,
    // backgroundColor: 'yellow',
    color: theme.textColor,
  },
});
