
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primaryColor,
    backgroundColor: COLORS.convert({ color: theme.primaryColor, lighten: 0.5 }),
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  noResultsText: {
    fontSize: 16,
    color: theme.darkText,
    paddingVertical: 10,
  },
});
