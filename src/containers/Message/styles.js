
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  inputWrap: {
    height: 60,
    backgroundColor: theme.secondaryColor,
    padding: 5,
  },
  chatBox: {
    height: 40,
    color: theme.textColor,
    backgroundColor: COLORS.convert({ color: theme.primaryColor, alpha: 0.4, lighten: 0.3 }),
    borderRadius: 3,
    fontSize: 15,
  },
});
