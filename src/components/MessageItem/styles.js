import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';
import videoUtils from '../../utils/video';

export default StyleSheet.create({
  row: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 10,
    maxWidth: theme.fullWidth - 80,
  },
  me: {
    marginLeft: 50,
    marginRight: 0,
    backgroundColor: theme.accentColor,
  },
  otherPerson: {
    marginRight: 50,
    marginLeft: 0,
    backgroundColor: theme.lightBackgroundColor,
  },
  video: {
    width: videoUtils.MESSAGE_WIDTH,
    borderRadius: 8,
    height: videoUtils.MESSAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meVideo: {
    // backgroundColor: theme.secondaryColor,
    marginLeft: 25,
  },
  otherPersonVideo: {
    // backgroundColor: theme.lightBackgroundColor,
  },
  playIcon: {
    backgroundColor: COLORS.TRANSPARENT,
    color: COLORS.convert({ color: COLORS.WHITE, alpha: 0.75 }),
  },
  vokebot: {
    backgroundColor: COLORS.TRANSPARENT,
    borderWidth: 2,
    borderColor: theme.secondaryColor,
  },
  vokeText: {
    color: theme.secondaryColor,
  },
  avatar: {
    width: 26,
    // height: 26,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
  },
  meText: {
    color: theme.textColor,
  },
  otherText: {
    color: theme.primaryColor,
  },
  time: {
    padding: 0,
    margin: 0,
  },
  meTime: {
    marginRight: 50,
  },
  otherPersonTime: {
    marginLeft: 50,
  },
  timeText: {
    fontSize: 12,
  },
  triangle: {
    width: 17,
    height: 0,
    marginBottom: 20,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
  },
  otherTriangle: {
    borderRightWidth: 13,
    borderRightColor: theme.lightBackgroundColor,
    paddingLeft: 4,
  },
  meTriangle: {
    borderLeftWidth: 13,
    borderLeftColor: theme.accentColor,
    paddingRight: 4,
  },
  vokeTriangle: {
    borderLeftColor: theme.secondaryColor,
  },
  dateSeparator: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  shareCircleButton: {
    marginHorizontal: 10,
  },
  relevanceBackground: {
    backgroundColor: '#3295AD',
  },
  selectionCircle: {
    height: 44,
    width: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'white',
    marginHorizontal: 5,
    marginVertical: 5,
    marginTop: 20,
  },
  green: {
    backgroundColor: '#7FDA00',
  },
  yellow: {
    backgroundColor: '#FFB900',
  },
  red: {
    backgroundColor: '#FF1C00',
  },
  answerText: {
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  inactiveSelection: {
    opacity: 0.4,
  },
});
