import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  modalTitleArea: {
    paddingBottom: theme.spacing.s,
    flexDirection: 'row',
  },
  modalTitleAction: {
    alignSelf: 'center',
    flex: 1,
    flexGrow: 1,
  },
  modalTitle: {
    alignSelf: 'center',
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.semiBold,
    // lineHeight: theme.fontSizes.xl * 1.3,
    textAlign: 'center',
  },
  buttonTitleCancel: {
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
  buttonLabelTitleCancel: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.white,
  },
  modalIntro: {
    textAlign: 'center',
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
    paddingHorizontal: theme.spacing.xl,
  },
});

export default styles;
