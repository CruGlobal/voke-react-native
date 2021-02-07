import { ReactText } from 'react';
import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: any } = {
  ...ui,
  MainContainer: [
    ui.container.default,
    {
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
  ],
  PrimaryContent: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
  },
  Divider: {
    width: '100%',
    backgroundColor: theme.colors.primary,
  },
  SectionAction: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    paddingTop: theme.spacing.m,
  },
  ButtonStart: [
    ui.button.size.l,
    ui.button.style.solid,
    {
      marginTop: theme.spacing.m,
      marginLeft: theme.spacing.l,
      marginRight: theme.spacing.l,
      marginBottom: theme.spacing.l,
    },
  ],
  ButtonStartLabel: [ui.buttonText.size.l, ui.buttonText.style.solid],
  ButtonSignIn: [ui.button.size.m, ui.button.style.outline],
  ButtonSignInLabel: [ui.buttonText.size.m, ui.buttonText.style.outline],
  SignInText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
  },
  TextSmall: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.regular,
  },
  TextLarge: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    paddingRight: theme.spacing.m,
    paddingLeft: theme.spacing.m,
  },
  Link: {
    textDecorationLine: 'underline',
    color: theme.colors.white,
  },
  SectionSignIn: {
    backgroundColor: theme.colors.primary,
    paddingBottom: theme.spacing.xl,
  },
};

export default styles;
