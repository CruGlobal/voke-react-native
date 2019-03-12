import { StyleSheet } from 'react-native';
import theme from '../../theme';

import videoUtils from '../../utils/video';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  video: {
    backgroundColor: theme.deepBlack,
    height: videoUtils.HEIGHT,
    width: videoUtils.WIDTH,
  },
  landscapeVideo: {
    backgroundColor: theme.deepBlack,
    height: theme.fullWidth,
    width: theme.fullHeight,
  },
  backHeader: {
    position: 'absolute',
    top: 9,
    left: 9,
    borderRadius: 14,
  },
  backImage: {},
});
