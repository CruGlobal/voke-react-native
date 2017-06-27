
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  row: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 10,
  },
  me: {
    marginLeft: 50,
    marginRight: 0,
    backgroundColor: theme.secondaryColor,
  },
  otherPerson: {
    marginRight: 50,
    marginLeft: 0,
    backgroundColor: theme.lightBackgroundColor,
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
    height: 26,
    backgroundColor: 'white',
    borderRadius: 13,
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
    width: 0,
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
    borderLeftColor: theme.secondaryColor,
    paddingRight: 4,
  },
  vokeTriangle: {
    borderLeftColor: theme.secondaryColor,
  },
});
