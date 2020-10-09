import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: 'transparent',
    marginHorizontal: theme.spacing.s,
  },
  childrenStyle: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.l,
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
    borderTopColor: theme.colors.lightGrey,
    borderStyle: 'solid',
  },
  causeOption: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGrey,
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
    color: theme.colors.grey,
  },
  modalFooterHighlight: {
    color: theme.colors.secondary,
  },
  modalFooterLink: {
    color: theme.colors.accent,
  },
});

export default styles;
