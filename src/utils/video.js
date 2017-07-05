import { Dimensions } from 'react-native';

const { width: deviceWidth } = Dimensions.get('window');

export default {
  WIDTH: deviceWidth,
  HEIGHT: deviceWidth * (9/16),
  MESSAGE_WIDTH: (deviceWidth / 2),
  MESSAGE_HEIGHT: (deviceWidth / 2) * (9/16),
};
