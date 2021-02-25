import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

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
  },
});

export default styles;
