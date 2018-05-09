
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
  detailsBackground: {
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  shareCircleButton: {
    marginHorizontal: 10,
  },
  detailsText: {
    fontSize: 11,
    color: theme.white,
    paddingHorizontal: 10,
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
