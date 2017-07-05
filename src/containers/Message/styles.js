
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  inputWrap: {
    backgroundColor: theme.secondaryColor,
    paddingHorizontal: 7,
  },
  chatBox: {
    paddingVertical: 5,
    marginVertical: 5,
    textAlignVertical: 'center',
    flex: 1,
    color: theme.textColor,
    paddingLeft: 10,
    backgroundColor: COLORS.convert({ color: theme.primaryColor, alpha: 0.4, lighten: 0.3 }),
    borderRadius: 3,
    fontSize: 16,
  },
  sendIcon: {
    flex: 0.1,
    paddingLeft: 13,
    // backgroundColor: 'yellow',
    color: theme.textColor,
  },
});
