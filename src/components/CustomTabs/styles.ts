import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

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
    opacity: 0.9,
  },
  tabBarTitleActive: {
    color: theme.colors.secondary,
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
    height: 3,
  },
  indicatorStyleWhite: {
    backgroundColor: theme.colors.secondary,
  },
});

export default styles;
