
import { StyleSheet } from 'react-native';
import theme, { COLORS, DEFAULT } from '../../theme';

export const THUMBNAIL_HEIGHT = (DEFAULT.FULL_WIDTH - 20) * 1/2;

export default StyleSheet.create({
  content: {
  },
  container: {
    margin: 10,
    backgroundColor: 'white',
    elevation: 2,
  },
  videoDetails: {
    height: 100,
    padding: 10,
  },
  videoThumbnail: {
    height: THUMBNAIL_HEIGHT,
    width: DEFAULT.FULL_WIDTH - 20,
    backgroundColor: COLORS.DEEP_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    backgroundColor: COLORS.TRANSPARENT,
    color: COLORS.convert({ color: COLORS.WHITE, alpha: 0.75 }),
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
