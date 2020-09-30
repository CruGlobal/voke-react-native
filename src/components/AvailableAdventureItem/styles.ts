import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  shareIcon: {
    marginRight: 10,
    color: theme.colors.white,
    height: 20,
    width: 20,
    marginBottom: 2,
  },
  shareLabel: {
    color: theme.colors.white,
    lineHeight: 20,
  },
  partsIcon: {
    color: theme.colors.white,
    height: 20,
    width: 20,
  },
  partsText: {
    letterSpacing: 2,
    fontSize: 10,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  thumb: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
  icon: {
    color: theme.colors.white,
  },
  inviteIcon: {
    width: 50,
    height: 50,
    color: theme.colors.white,
  },
});

export default styles;
