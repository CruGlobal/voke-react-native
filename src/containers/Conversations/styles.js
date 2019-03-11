import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    marginBottom: 0,
  },
  vokebotWrap: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: -10,
  },
  vokebot: {
    alignSelf: 'flex-end',
    marginBottom: -25,
    marginRight: -25,
  },
  chatBubble: {
    borderRadius: 5,
    backgroundColor: theme.white,
    padding: 13,
    marginRight: 15,
    width: theme.fullWidth - 100,
  },
  chatText: {
    color: theme.accentColor,
    fontSize: 14,
    textAlign: 'center',
  },
  chatTriangle: {
    alignSelf: 'flex-end',
    marginRight: 50,
    width: 17,
    height: 0,
    marginBottom: 10,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 13,
    borderRightColor: theme.lightBackgroundColor,
  },
});
