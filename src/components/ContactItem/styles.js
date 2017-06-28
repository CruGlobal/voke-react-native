
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  row: {
    paddingHorizontal: 10,
    // paddingVertical: 10,
    height: 50,
  },
  avatar: {
    width: 26,  
    height: 26,
    backgroundColor: theme.secondaryColor,
    borderRadius: 13,
    marginRight: 15,
  },
  name: {
    fontSize: 16,
    color: theme.darkText,
  },
});
