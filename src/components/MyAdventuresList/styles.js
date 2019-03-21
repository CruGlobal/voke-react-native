import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export const THUMBNAIL_HEIGHT = 78;
export const THUMBNAIL_WIDTH = 64;

export default StyleSheet.create({
  container: {
    marginVertical: 10,
    alignSelf: 'center',
    width: theme.fullWidth - 40,
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
    flex: 1,
    width: THUMBNAIL_WIDTH,
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
    fontSize: 12,
    color: 'white',
    height: 20,
    width: 20,
    borderRadius: 25,
  },
});
