
import { StyleSheet, Platform } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  content: {
    flex: 1,
  },
  container: {
    paddingVertical: 10,
    backgroundColor: theme.primaryColor,
  },
  conversationName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  avatar: {
    marginHorizontal: 8,
  },
  creatorText: {
    fontSize: 14,
  },
  messagePreviewWrapper: {
    fontSize: 14,
    marginRight: 15,
  },
  messagePreviewText: {
  },
  avatarWrapper: {
    padding: 2,
  },
  conversationArrow: {
    padding: 2,
    paddingRight: 5,
  },
  // Create different object for ios/android
  arrowImage: Platform.select({
    ios: {
      width: 20,
      height: 7,
    },
    android: {
      width: 24,
      height: 15,
      paddingBottom: 10,
    },
  }),
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.secondaryColor,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backTextWhite: {
    color: COLORS.WHITE,
    fontSize: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 65,
  },
  backRightBtnLeft: {
    backgroundColor: theme.secondaryColor,
    right: 65,
  },
  backRightBtnRight: {
    backgroundColor: theme.secondaryColor,
    right: 0,
  },
});
