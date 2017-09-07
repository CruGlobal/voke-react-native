
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  content: {
    flex: 1,
  },
  container: {
    paddingVertical: 10,
    backgroundColor: theme.primaryColor,
    // paddingBottom: 30,
  },
  conversationName: {
    fontWeight: 'bold',
    fontSize: 15,
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
  arrowImage: {
    width: 20,
    height: 7,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
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
