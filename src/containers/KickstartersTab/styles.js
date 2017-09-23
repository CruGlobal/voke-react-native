
import { StyleSheet } from 'react-native';
import theme, {DEFAULT} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
    paddingBottom: 15,
  },
  nothingText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  description: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 70,
    textAlign: 'center',
  },
  listWrap: {
    paddingVertical: 20,
  },
  kickstarterWrap: {
    backgroundColor: theme.accentColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: DEFAULT.FULL_WIDTH - 80,
  },
  kickstarterText: {
    fontSize: 16,
  },
  chatImageWrap: {
    paddingVertical: 30,
  },
  chatImage: {
    width: 60,
    height: 60,
  },
});
