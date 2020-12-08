import { StyleSheet } from 'react-native';

import theme from 'utils/theme';

const styles = StyleSheet.create({
  nextActionContainer: {
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
  },

  nextActionButton: {
    paddingVertical: 20,
    paddingHorizontal: theme.spacing.s,
    borderRadius: theme.radius.xxl,
    backgroundColor: 'transparent',
  },

  nextActionButtonLabel: {
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: theme.colors.white,
  },

  iconAction: {
    color: theme.colors.secondary,
    paddingRight: 10,
  },
});

export default styles;
