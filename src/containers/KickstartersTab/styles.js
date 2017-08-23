
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
  },
  description: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 70,
    textAlign: 'center',
  },
  chatImageWrap: {
    paddingVertical: 30,
  },
  chatImage: {
    width: 60,
    height: 60,
  },
});
