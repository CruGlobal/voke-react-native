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
  card: {
    backgroundColor: 'floralwhite',
    borderRadius: theme.radius.l,
    // height: theme.window.width * 0.8,
    height: 300,
    // width: 100,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcon: {
    color: theme.colors.primary,
  },
  cardTitle: { fontSize: theme.fontSizes.xxl },
  cardDescription: {
    textAlign: 'center',
    lineHeight: theme.fontSizes.m * 1.3,
  },
  cardRecommended: {
    color: theme.colors.orange,
    // position: 'absolute',
    top: -theme.spacing.s,
  },
});

export default styles;
