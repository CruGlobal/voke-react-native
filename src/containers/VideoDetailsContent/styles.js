import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

import videoUtils from '../../utils/video';

export default StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: theme.white,
    padding: 15,
  },
  container: {
    flex: 1,
    backgroundColor: theme.lightBackgroundColor,
    ...(theme.isIphoneX
      ? {
          backgroundColor: COLORS.DEEP_BLACK,
          paddingTop: 40,
        }
      : {}),
  },
  video: {
    backgroundColor: COLORS.DEEP_BLACK,
    height: videoUtils.HEIGHT,
    width: videoUtils.WIDTH,
  },
  landscapeVideo: {
    backgroundColor: COLORS.DEEP_BLACK,
    height: theme.fullWidth,
    width: theme.fullHeight,
  },
  label: {
    color: theme.primaryColor,
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  videoTitle: {
    color: theme.primaryColor,
    fontSize: 20,
    fontWeight: '500',
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
  },
  // backIcon: {
  //   color: COLORS.convert({ color: COLORS.BLACK, alpha: 0.7 }),
  // },
  backImage: {},
  kickstarterSeparator: {
    borderBottomColor: theme.darkText,
    borderBottomWidth: 1,
    width: 20,
    marginVertical: 10,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 0,
    backgroundColor: COLORS.LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteFilled: {
    backgroundColor: theme.primaryColor,
  },
});