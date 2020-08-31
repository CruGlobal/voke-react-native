import { StyleSheet } from 'react-native';

import theme from '../../theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  icon: {
    color: theme.colors.white,
  },
  iconPlay: {
    marginTop: 25,
    color: theme.colors.transparent,
  },
  iconPause: {
    marginTop: 25,
    color: 'rgba(255,255,255,0.6)',
  },
});

export default styles;
