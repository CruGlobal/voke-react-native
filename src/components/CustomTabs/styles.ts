import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.primary,
  },
  tabBarWhite: {
    backgroundColor: theme.colors.white,
  },
  tabBarTitle: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  tabBarTitleActive: {
    color: theme.colors.black,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  tabBarTitleWhite: {
    color: theme.colors.grey,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  tabBarTitleWhiteActive: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  indicatorStyle: {
    backgroundColor: theme.colors.secondary,
  },
  indicatorStyleWhite: {
    backgroundColor: theme.colors.secondary,
  },
});

export default styles;
