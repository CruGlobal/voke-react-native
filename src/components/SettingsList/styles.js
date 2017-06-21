
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
  content: {
    flex: 1,
  },
  container: {
    paddingVertical: 10,
    // paddingBottom: 30,
  },
  conversationName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  messagePreviewText: {
    fontSize: 14,
  },
  avatarWrapper: {
    padding: 2,
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  conversationArrow: {
    padding: 2,
  },
});
