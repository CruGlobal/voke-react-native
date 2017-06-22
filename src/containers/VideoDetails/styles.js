
import { StyleSheet, Dimensions } from 'react-native';
import theme, { COLORS } from '../../theme';

const { width: deviceWidth } = Dimensions.get('window');


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  video: {
    height: 200,
    width: deviceWidth,
    backgroundColor: 'red',
  },
});
