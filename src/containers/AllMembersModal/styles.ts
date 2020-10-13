import { StyleSheet } from 'react-native';

import theme from '../../theme';
const THUMBNAIL_WIDTH = 140;

const sharedStyles = {
  memberBlock: {
    width: theme.window.width / 2,
    height: theme.window.width / 2,
    padding: theme.spacing.l,
    justifyContent: 'center',
  },
  memberInner: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.s,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.secondaryAlt,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    backgroundColor: theme.colors.primary,
  },
  invite: {
    paddingTop: theme.spacing.s,
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  inviteCode: {
    color: theme.colors.white,
    fontFamily: theme.fonts.semiBold,
  },
  members: {
    paddingVertical: theme.spacing.l,
  },
  memberOuter: {
    ...sharedStyles.memberBlock,
  },
  adminOuter: {
    ...sharedStyles.memberBlock,
    padding: theme.spacing.s,
    marginTop: -theme.spacing.m,
  },
  memberInner: {
    ...sharedStyles.memberInner,
  },
  adminInner: {
    ...sharedStyles.memberInner,
    backgroundColor: theme.colors.secondary,
  },
  iconDeleteBlock: {
    position: 'absolute',
    right: -11,
    top: -10,
  },
  iconDelete: {
    color: theme.colors.white,
  },
});

export default styles;
