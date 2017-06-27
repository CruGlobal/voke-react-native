import { Dimensions } from 'react-native';

const { width: deviceWidth } = Dimensions.get('window');

export default {
  WIDTH: deviceWidth,
  HEIGHT: deviceWidth * (9/16),
};
