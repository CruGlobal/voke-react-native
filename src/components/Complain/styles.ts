import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: 'transparent',
    marginHorizontal: theme.spacing.s,
  },
  childrenStyle: {
    // backgroundColor: 'rgba(255,255,255,.3)',
    borderRadius: theme.radius.l,
    overflow: 'hidden',
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(255,255,255,.3)',
  },
  modalBlurAndroid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.white,
  },
  modalContent: {
    minHeight: '100%',
  },
  modalTitle: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.semiBold,
    paddingBottom: theme.spacing.m,
    paddingVertical: theme.spacing.l,
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
  causeTitle: {
    textAlign: 'center',
    color: theme.colors.accent,
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.4,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  causeOptions: {
    flex: 1,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(100,100,100,.2)',
    borderStyle: 'solid',
  },
  causeOption: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100,100,100,.2)',
    borderStyle: 'solid',
  },
  causeOptionLabel: {
    textAlign: 'left',
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.xl * 1.4,
  },
  complainConfirmationIcon: {
    color: theme.colors.accent,
    alignSelf: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  complainConfirmationText: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.4,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  modalFooter: {
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'flex-end',
  },
  modalFooterText: {
    textAlign: 'center',
    color: theme.colors.darkGrey,
  },
  modalFooterHighlight: {
    color: theme.colors.darkGrey,
  },
  modalFooterLink: {
    color: theme.colors.accent,
  },
});

export default styles;
