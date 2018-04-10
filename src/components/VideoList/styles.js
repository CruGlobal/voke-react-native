
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export const THUMBNAIL_HEIGHT = (theme.fullWidth - 20) * 1/2;

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
  thumbnailWrap: {
    height: THUMBNAIL_HEIGHT,
  },
  videoThumbnail: {
    alignItems: 'center',
    justifyContent: 'center',
    height: THUMBNAIL_HEIGHT,
    width: theme.fullWidth - 20,
    backgroundColor: COLORS.DEEP_BLACK,
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
  blankText: {
    fontSize: 16,
    paddingTop: 10,
    textAlign: 'center',
  },
});
