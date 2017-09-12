
import { StyleSheet } from 'react-native';
import theme, {DEFAULT, COLORS} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  selectedTab: {
    height: 4,
    backgroundColor: COLORS.YELLOW,
  },
  unSelectedTab: {
    height: 4,
    backgroundColor: theme.secondaryColor,
  },
});
