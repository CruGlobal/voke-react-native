
import { StyleSheet } from 'react-native';
import theme, { COLORS} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    marginBottom: 0,
  },
  vokeBot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
