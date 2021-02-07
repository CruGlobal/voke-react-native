import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  bluredBlock: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bluredImage: {
    width: '92%',
    height: 800,
    position: 'absolute',
    left: '4%',
    top: 10,
    // Background needed to cover name of the messenger.
    backgroundColor: theme.colors.secondary,
  },
  icon: {
    color: theme.colors.white,
  },
});

export default styles;
