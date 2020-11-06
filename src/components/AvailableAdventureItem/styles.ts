import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  card: {
    borderRadius: theme.radius.s,
    // paddingHorizontal: theme.spacing.m,
    minHeight: 200,

    borderStyle: 'solid',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,.15)',

    ...theme.shadow,
  },
  backFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: theme.radius.s,
  },
  badgeStarted: {
    borderRadius: theme.radius.xxl,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.s * 1.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  badgeStartedText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.semiBold,
    letterSpacing: 2,
    color: theme.colors.white,
  },
  badgeStartedIcon: {
    color: theme.colors.white,
    paddingLeft: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
    paddingVertical: theme.spacing.s,
  },
  /* shareLabel: {
    color: theme.colors.white,
    lineHeight: 20,
  }, */

  shareIcon: {
    marginTop: -theme.spacing.l,
    marginRight: -theme.spacing.s,
    marginLeft: theme.spacing.xs,
  },

  bottomLine: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: theme.spacing.m,
    borderBottomStartRadius: theme.radius.m,
    borderBottomEndRadius: theme.radius.m,
    height: 30,
  },
  partsIcon: {
    color: theme.colors.white,
    height: 12,
    width: 12,
    marginRight: theme.spacing.xs,
  },
  smallText: {
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
  inviteIcon: {
    width: 50,
    height: 50,
    color: theme.colors.white,
  },
});

export default styles;
