import { StyleSheet } from 'react-native';
import theme from '../../theme';
const TRIANGLE = 15;
const VB_WIDTH = theme.fullWidth * 0.2;
const VB_MARGIN = -35;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  title: {
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.accentColor,
    padding: 10,
    width: theme.fullWidth,
  },
  nullText: {
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 30,
    textAlign: 'center',
    marginTop: 15,
  },
  vokebot: {
    alignSelf: 'center',
    marginBottom: VB_MARGIN,
    width: VB_WIDTH,
  },
  chatBubble: {
    borderRadius: 5,
    backgroundColor: theme.accentColor,
    padding: 13,
  },
  chatText: {
    color: theme.white,
    fontSize: 14,
    textAlign: 'center',
  },
  chatTriangle: {
    position: 'absolute',
    bottom: 60,
    width: 0,
    height: 0,
    right: theme.fullWidth - 170,
    borderRightWidth: TRIANGLE,
    borderBottomWidth: TRIANGLE * 2,
    borderLeftWidth: TRIANGLE,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.accentColor,
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  browseButton: {
    backgroundColor: theme.orange,
    borderRadius: 20,
    height: 40,
    borderWidth: 0,
  },
  browseText: {
    color: 'white',
  },
  inviteCodeButton: {
    width: theme.fullWidth - 40,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
});
