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
  messagePreviewText: {},
  avatarWrapper: {
    padding: 2,
  },
  conversationArrow: {
    padding: 2,
    paddingRight: 5,
  },
  conversationArrowIcon: {
    color: COLORS.YELLOW,
  },
  disabledButton: {
    opacity: 0.1,
  },
  // Create different object for ios/android
  arrowImage: Platform.select({
    ios: {
      color: theme.secondaryColor,
    },
    android: {
      color: theme.secondaryColor,
      paddingBottom: 10,
    },
  }),
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.secondaryColor,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
    position: 'relative',
  },
  backTextWhite: {
    color: COLORS.WHITE,
    fontSize: 10,
  },
  rowBackButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // width: 65,
  },
});
