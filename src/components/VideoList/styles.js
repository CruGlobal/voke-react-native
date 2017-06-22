
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../theme';

const { width: deviceWidth } = Dimensions.get('window');

export default StyleSheet.create({
  content: {
  },
  container: {
    margin: 10,
    backgroundColor: 'white',
  },
  videoText: {
    padding: 10,
  },
  videoThumbnail: {
    height: (deviceWidth - 20) * 1/2,
    width: deviceWidth -20,
    backgroundColor: 'red',
  },
  videoTitle: {
    color: theme.primaryColor,
    fontSize: 20,
  },
  videoDescription: {
    color: theme.darkText,
    fontSize: 16,
  },
});
