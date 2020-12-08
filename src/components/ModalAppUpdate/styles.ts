import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
  },
  modalTitle: {
    textAlign: 'center',
    color: theme.colors.darkGrey,
    fontSize: theme.fontSizes.l,
    paddingBottom: theme.spacing.m,
    paddingVertical: theme.spacing.l,
  },
  modalHeader: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
    textAlign: 'center',
    paddingBottom: theme.spacing.m,
    paddingVertical: theme.spacing.l,
  },
  callToActionBlock: {
    width: '100%',
  },
  secondaryAction: {
    color: theme.colors.primary,
    paddingVertical: theme.spacing.l,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.semiBold,
  },
  subActionText: {
    textAlign: 'center',
    color: theme.colors.darkGrey,
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
});

export default styles;
