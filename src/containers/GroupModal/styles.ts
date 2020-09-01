import { StyleSheet } from 'react-native';

import theme from '../../theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    flexDirection: 'column',
    alignContent: 'stretch',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
  },
  title: {
    backgroundColor: theme.colors.secondaryAlt,
    borderRadius: 10,
    paddingTop: theme.spacing.m,
    // width: '100%',
  },
});

export default styles;
