
import { StyleSheet } from 'react-native';
import theme, { DEFAULT, COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.3)',
    // paddingBottom: 10,
    // paddingHorizontal: 40,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  modal: {
    width: DEFAULT.FULL_WIDTH -20,
    height: DEFAULT.FULL_HEIGHT / 3,
    backgroundColor: COLORS.OFF_WHITE,
    // marginTop: DEFAULT.FULL_HEIGHT / 1.8 - 20,
    position: 'absolute',
    bottom: 70,
    borderRadius: 10,
    overflow: 'hidden',
  },
  androidModal: {
    width: DEFAULT.FULL_WIDTH,
    // height: DEFAULT.FULL_HEIGHT / 2,
    backgroundColor: COLORS.WHITE,
    // marginTop: DEFAULT.FULL_HEIGHT / 1.8 - 20,
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
  },
  iconWrap: {
    overflow: 'hidden',
    borderRadius: 12,
    width: DEFAULT.FULL_WIDTH / 6.5,
    height: DEFAULT.FULL_WIDTH / 6.5,
  },
  shareAction: {
    paddingHorizontal: 10,
    width: (DEFAULT.FULL_WIDTH - 20) /4,
  },
  iconStyle: {
    width: DEFAULT.FULL_WIDTH / 6.5,
    height: DEFAULT.FULL_WIDTH / 6.5,
  },
  androidIcons: {
    color: COLORS.CHARCOAL,
  },
  iconText: {
    color: COLORS.CHARCOAL,
    fontSize: 12,
    textAlign: 'center',
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  button: {
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 0,
    // marginVertical: 12,
    width: DEFAULT.FULL_WIDTH -20,
  },
  buttonText: {
    color: theme.secondaryColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
