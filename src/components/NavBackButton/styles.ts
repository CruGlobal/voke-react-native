import { StyleSheet } from 'react-native';
import theme from 'utils/theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  touchable: {
    // Extra padding to make taps more responsive.
    paddingTop: 6,
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 8,
  },
  backIconContainer: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  backIcon: {
    fontSize: 18,
    marginTop: 1,
    marginLeft: -35,
    color: 'rgba(255,255,255,0.9)',
  },
  menuIcon: {
    fontSize: 26,
    marginTop: 1,
    marginLeft: 6,
    color: theme.colors.secondary,
  },
});

export default styles;
