import { StyleSheet } from 'react-native';
import theme from '../../theme';
const TRIANGLE = 25;
const VB_WIDTH = theme.fullWidth * 0.2;
const VB_MARGIN = -15;

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
  vokebotWrap: {
    marginRight: 15,
    // position: 'absolute',
    // bottom: 0,
    // right: 0,
    // zIndex: -10,
  },
  vokebot: {
    transform: [{ rotate: '45deg' }],
    alignSelf: 'flex-end',
    marginLeft: VB_MARGIN,
    width: VB_WIDTH,
  },
  chatBubble: {
    borderRadius: 5,
    backgroundColor: theme.secondaryColor,
    padding: 13,
    marginLeft: TRIANGLE / 2,
  },
  chatText: {
    color: theme.white,
    fontSize: 14,
    textAlign: 'center',
  },
  chatTriangle: {
    position: 'absolute',
    left: VB_WIDTH + VB_MARGIN,
    bottom: 50,
    width: 0,
    height: 0,
    borderRightWidth: TRIANGLE,
    borderBottomWidth: TRIANGLE * 2,
    borderLeftWidth: TRIANGLE,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.secondaryColor,
    borderLeftColor: 'transparent',
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
});
