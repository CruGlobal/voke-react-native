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



  modalStyle: {
    backgroundColor: 'transparent',
    marginHorizontal: theme.spacing.s,
  },
  childrenStyle: {
    // backgroundColor: 'rgba(255,255,255,.3)',
    borderRadius: theme.radius.l,
    overflow: 'hidden',
  },
  modalContent: {
    minHeight: '100%',
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },
  modalActions: {
    paddingBottom: theme.spacing.s,
  },
  actionButton: {
    backgroundColor: theme.colors.white,
    marginTop: theme.spacing.s,
    borderRadius: theme.radius.l,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonLabel: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
  },
  modalBlurAndroid: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.white,
  },
  modalBlur: {
    ...StyleSheet.absoluteFill,
  },
  modalTitle: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    paddingBottom: theme.spacing.m,
    paddingVertical: theme.spacing.l,
  },
  modalText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    textAlign: 'center',
  },
  confirmationIcon: {
    color: theme.colors.green,
    alignSelf: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  confirmationTitle: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.4,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  confirmationText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    textAlign: 'center',
  },
});

export default styles;
