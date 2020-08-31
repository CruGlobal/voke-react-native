import { StyleSheet } from 'react-native';

import theme from '../../theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  vokebot: {
    position: 'absolute',
    left:-25,
    bottom:-20,
    width:70,
    height:70,
    color: theme.colors.white,
  },
  avatar: {
    position: 'absolute',
    right: -30,
    height: 25,
    width: 25,
    borderRadius: 50,
  }
});

export default styles;
