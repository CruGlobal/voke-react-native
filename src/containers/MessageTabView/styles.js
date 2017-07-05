
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  tabController: {
    padding: 10,
    backgroundColor: theme.secondaryColor,
  },
});
