
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
    justifyContent: 'flex-end',
  },
  inputWrap: {
    height: 50,
    backgroundColor: theme.secondaryColor,
  },
  chatBox: {
    height: 40,
    margin: 5,
    color: theme.textColor,
    backgroundColor: COLORS.convert({ color: theme.primaryColor, alpha: 0.4, lighten: 0.3 }),
    borderRadius: 3,
    fontSize: 15,
  },
});
