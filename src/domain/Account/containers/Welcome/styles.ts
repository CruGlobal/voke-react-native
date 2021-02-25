import { StyleSheet } from 'react-native';
import theme from 'utils/theme';
import ui from 'utils/ui';

const styles = StyleSheet.create({
  Screen: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  SectionOnboarding: {},
  mainActions: {
    // For tablets:
    justifyContent: 'center',
    paddingVertical: theme.spacing.m,
    paddingBottom:
      theme.window.height > 760 ? theme.spacing.l : theme.spacing.s,
  },
  ButtonSignIn: { ...ui.button.size.m, ...ui.button.style.outline },
  ButtonSignInLabel: {
    ...ui.buttonText.size.m,
    ...ui.buttonText.style.outline,
  },
  SignInText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
  },
  TextSmall: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },
  TextHaveCode: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    textShadowColor: 'rgba(32, 20, 16, .8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    padding: 1,
  },
  Link: {
    textDecorationLine: 'underline',
    color: theme.colors.white,
  },
  SectionSignIn: {
    backgroundColor: 'transparent',
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.l,
  },
  HelpSection: {
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
    maxWidth: 440,
    alignSelf: 'center',
  },
  HelpSectionHeading: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.s,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },
  helpSectionButton: {
    padding: theme.spacing.l,
    position: 'absolute',
    bottom: -theme.spacing.l,
    // For tablets.
    right: 0,
  },
  helpSectionIcon: {
    textAlign: 'right',
    color: theme.colors.white,
  },
});

export default styles;
