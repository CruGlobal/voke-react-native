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
  },
  title: {
    borderRadius:10,
    paddingHorizontal: theme.spacing.xl,
  },
});

export default styles;
