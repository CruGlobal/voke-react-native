import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export const THUMBNAIL_HEIGHT = 64;

export default StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailWrap: {
    height: THUMBNAIL_HEIGHT,
  },
  detailsText: {
    fontSize: 11,
    color: theme.white,
    paddingHorizontal: 10,
  },
  adventureThumbnail: {
    height: THUMBNAIL_HEIGHT,
    width: THUMBNAIL_HEIGHT,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  adventureTitle: {
    color: theme.primaryColor,
    fontSize: 16,
  },
  adventureUser: {
    color: theme.darkText,
    fontSize: 12,
  },
  blankText: {
    fontSize: 16,
    paddingTop: 10,
    textAlign: 'center',
  },
  notification: {
    backgroundColor: 'orange',
    fontSize: 16,
    color: 'white',
    height: 40,
    width: 40,
    borderRadius: 25,
  },
});
