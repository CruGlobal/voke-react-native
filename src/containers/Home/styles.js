
import { StyleSheet } from 'react-native';
import theme, {DEFAULT, COLORS} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondaryColor,
    marginBottom: 0,
  },
  vokeBot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  selectedTab: {
    width: DEFAULT.FULL_WIDTH/2,
    height: 4,
    backgroundColor: COLORS.YELLOW,
  },
});
