import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.m,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.m,
    height: '100%',
  },
  stepCard: {
    marginBottom: theme.spacing.xxs,
    borderRadius: theme.radius.m,
    overflow: 'hidden',
  },
  cardContent: {
    minHeight: 110,
  },
  stepWrapper: {
    paddingBottom: theme.spacing.s,
  },
  thumbContainer: {
    justifyContent: 'center',
  },
  thumb: {
    width: 140,
    flex: 1,
  },
  thumbIcon: {
    opacity: 0.9,
    width: 30,
    height: 30,
    color: theme.colors.white,
    position: 'absolute',
    alignSelf: 'center',
  },
  titleActive: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
  },
  titleInactive: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.white,
  },
  partActive: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.secondary,
  },
  partInactive: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.white,
  },
  stepNumberContainer: {
    position: 'absolute',
    bottom: -28,
    right: 0,
    paddingHorizontal: theme.spacing.s,
  },
  stepNumber: {
    fontSize: 72,
  },
  iconCompleted: {
    color: theme.colors.white,
  },
  iconUnread: {
    color: theme.colors.white,
    marginTop: -1,
    marginRight: 6,
  }
});

export default styles;
