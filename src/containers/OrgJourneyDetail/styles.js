import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: theme.fullWidth,
    borderRightWidth: theme.fullWidth,
    borderBottomWidth: 80,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.primaryColor,
  },
});
