import { StyleSheet } from 'react-native';

import theme from 'utils/theme';

const styles = StyleSheet.create({
  ctaManageContainer: {
    paddingTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
  },
  ctaManage: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.s,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    // justifyContent: 'flex-end',
    alignContent: 'center',
    flexDirection: 'row',
  },
  ctaManageLabel: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.4,
    paddingLeft: theme.spacing.m,
  },
  ctaManageIcon: {
    color: theme.colors.white,
  },
  ListOfSteps: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.l,
  },
});

export default styles;
