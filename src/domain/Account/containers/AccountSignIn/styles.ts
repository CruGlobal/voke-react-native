import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const sharedStyles = {
  ButtonSignIn: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: theme.radius.xxl,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.colors.white,
    flex: 1,
    alignSelf: 'center',
  },
  ButtonSignInLabel: {
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    color: theme.colors.white,
  },
  ButtonSignInIcon: {
    color: theme.colors.white,
    marginRight: theme.spacing.l,
  },
};

const styles = StyleSheet.create({
  ...sharedStyles,

  buttonSignInPrimary: {
    ...sharedStyles.ButtonSignIn,
    backgroundColor: theme.colors.white,
  },
  buttonSignInLabelPrimary: {
    ...sharedStyles.ButtonSignInLabel,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.secondary,
  },
  buttonSignInIconPrimary: {
    ...sharedStyles.ButtonSignInIcon,
    color: theme.colors.secondary,
  },

  signInOptions: {},

  mainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  primaryContent: {
    justifyContent: 'center', // Vertical.
    flexGrow: 1,
    width: '100%',
  },
  divider: {
    width: '100%',
    backgroundColor: theme.colors.primary,
  },
  sectionAction: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    paddingBottom: theme.spacing.m,
  },
  buttonStart: {
    paddingVertical: 20,
    paddingHorizontal: theme.spacing.s,
    borderRadius: theme.radius.xxl,
    backgroundColor: theme.colors.white,
    marginTop: theme.spacing.m,
    marginLeft: theme.spacing.l,
    marginRight: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  buttonStartLabel: {
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.35,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    color: theme.colors.secondary,
  },
  link: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: theme.colors.white,
    marginTop: 20,
  },
  sectionNotice: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
  },
  textMedium: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },
});

export default styles;
