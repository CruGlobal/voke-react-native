import { StyleSheet } from 'react-native';
import theme from '../../theme';

const TRIANGLE = 25;
const VB_WIDTH = theme.fullWidth * 0.2;
const VB_MARGIN = -15;

export default StyleSheet.create({
  list: {
    flex: 1,
    paddingBottom: 18,
    paddingTop: 5,
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
    alignSelf: 'flex-start',
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
  inviteCodeButton: {
    width: theme.fullWidth - 40,
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'center',
  },
});
