
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

import videoUtils from '../../utils/video';

export default StyleSheet.create({
  video: {
    backgroundColor: COLORS.DEEP_BLACK,
    height: videoUtils.HEIGHT,
    width: videoUtils.WIDTH,
  },
  backHeader: {
    position: 'absolute',
    top: 9,
    left: 9,
    borderRadius: 14,
    backgroundColor: COLORS.convert({ color: COLORS.WHITE, alpha: 0.8 }),
  },
  backIcon: {
    color: COLORS.convert({ color: COLORS.BLACK, alpha: 0.4 }),
  },
});
