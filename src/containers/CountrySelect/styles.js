
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.lightBackgroundColor,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primaryColor,
    backgroundColor: COLORS.convert({ color: theme.primaryColor, lighten: 0.5 }),
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  row: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: theme.lightBackgroundColor,
  },
  name: {
    fontSize: 16,
    color: theme.darkText,
  },
  noResultsText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
    color: theme.darkText,
  },
});
