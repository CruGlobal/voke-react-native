
import { StyleSheet } from 'react-native';
import theme, { COLORS, DEFAULT } from '../../theme';

export const THUMBNAIL_HEIGHT = (DEFAULT.FULL_WIDTH - 20) * 1/2;

export default StyleSheet.create({
  content: {
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 0,
    backgroundColor: 'white',
    elevation: 2,
    width: DEFAULT.FULL_WIDTH/1.7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  channelName: {
    height: 50,
    padding: 10,
    backgroundColor: COLORS.LIGHTEST_GREY,
  },
  videoThumbnail: {
    height: 120,
    width: DEFAULT.FULL_WIDTH/1.7,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    backgroundColor: COLORS.TRANSPARENT,
    color: COLORS.convert({ color: COLORS.WHITE, alpha: 0.75 }),
  },
  channelTitle: {
    color: theme.darkText,
    fontSize: 16,
  },
  videoDescription: {
    color: theme.darkText,
    fontSize: 16,
  },
});