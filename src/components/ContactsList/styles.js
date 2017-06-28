
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primaryColor,
    backgroundColor: COLORS.convert({ color: theme.primaryColor, alpha: 0.2 }),
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
