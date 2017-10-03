
import { StyleSheet } from 'react-native';
import theme from '../../theme';

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
    zIndex: -10,
  },
});
