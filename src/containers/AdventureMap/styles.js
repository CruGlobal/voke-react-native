
import { StyleSheet } from 'react-native';
import theme, {COLORS} from '../../theme';

export default StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: theme.fullWidth,
    height: '100%',
    backgroundColor: theme.primaryColor,
    paddingTop: theme.fullHeight / 4,
  },
  loadingText: {
    fontSize: 16,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 22,
    color: COLORS.GREEN,
    paddingTop: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
