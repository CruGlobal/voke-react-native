
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

import videoUtils from '../../utils/video';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightBackgroundColor,
  },
  video: {
    backgroundColor: COLORS.DEEP_BLACK,
    height: videoUtils.HEIGHT,
    width: videoUtils.WIDTH,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  label: {
    color: theme.primaryColor,
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  videoTitle: {
    color: theme.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  detail: {
    color: theme.darkText,
    fontSize: 14,
    marginBottom: 3,
  },
  backHeader: {
    position: 'absolute',
    top: 9,
    left: 9,
    borderRadius: 14,
    backgroundColor: COLORS.convert({ color: COLORS.WHITE, alpha: 0.8 }),
  },
  backIcon: {
    color: COLORS.convert({ color: COLORS.BLACK, alpha: 0.7 }),
  },
  kickstarterSeparator: {
    borderBottomColor: theme.darkText,
    borderBottomWidth: 1,
    width: 20,
    marginVertical: 10,
  },
});
