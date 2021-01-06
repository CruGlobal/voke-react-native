import { ReactText } from 'react';
import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: any } = {
  ...theme,
  SectionAction: {
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
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
  ButtonStartLabel: [ui.buttonText.size.l],
  ButtonSignUp: [ui.button.size.outlinel, ui.button.style.outline],
  ButtonSignUpLabel: [ui.buttonText.size.m, ui.buttonText.style.outline],
  ButtonAction: [ui.button.size.m, ui.button.style.outline],
  ButtonActionLabel: [
    ui.buttonText.size.m,
    {
      marginTop: theme.spacing.l,
      textDecorationLine: 'underline',
    },
  ],
  ButtonActionTextOnly: [
    {
      marginTop: 10,
      textAlign: 'center',
      textDecorationLine: 'underline',
      color: theme.colors.white,
    },
  ],

  SignInText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.m,
    fontFamily: theme.fonts.regular,
  },
  TextSmall: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.regular,
  },
  Link: {
    textDecorationLine: 'underline',
    color: theme.colors.white,
  },
  SectionSignIn: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
  },
};

export default styles;
