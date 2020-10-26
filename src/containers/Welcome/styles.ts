import { StyleSheet } from 'react-native';

import theme from '../../theme';
import ui from '../../ui';

const sharredStyles = {
};

const styles = StyleSheet.create({
  SectionOnboarding: {
    // Responsive margin to fit everything on small devices.
    // paddingHorizontal: theme.window.width > 700 ? theme.spacing.l : 0,
    // paddingVertical: theme.window.width > 700 ? theme.spacing.xl : 0,
  },
  mainActions: {
    // For tablets:
    justifyContent: 'center',
    // flexDirection: theme.window.width > 500 ? 'row' : 'column',
    paddingVertical: theme.spacing.m,
    paddingBottom: theme.window.height > 760 ? theme.spacing.l : theme.spacing.s,
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
  Link: {
    textDecorationLine: 'underline',
    color: theme.colors.white,
  },
  SectionSignIn: {
    backgroundColor: 'transparent',
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
  },
  HelpSection: {
    // marginBottom: -10,
    // minHeight: 30,
    // flex:1,
    // maxWidth: theme.window.width > 500 ? '50%' : '100%',
  },
  HelpSectionInner: {
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
    // right: theme.window.width > 500 ? 'auto' : 0,
    // left: theme.window.width > 500 ? theme.spacing.xl : 'auto',
  },
  helpSectionIcon: {
    textAlign: 'right',
    color: theme.colors.white,
  },
});

export default styles;
