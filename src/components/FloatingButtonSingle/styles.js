
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primaryColor,
    // shadowOpacity: 0.35,
    // shadowOffset: {
    //   width: 0, height: 2,
    // },
    // shadowColor: '#000',
    // shadowRadius: 1,
    // elevation: 5,
  },
  iconWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
