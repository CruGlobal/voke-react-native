import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default {
  WIDTH: deviceWidth,
  HEIGHT: deviceWidth * (9/16),
  LANDSCAPE_WIDTH: deviceHeight,
  LANDSCAPE_HEIGHT: deviceWidth,
  MESSAGE_WIDTH: (deviceWidth / 2),
  MESSAGE_HEIGHT: (deviceWidth / 2) * (9/16),
};
