// import { ReactText } from 'react';
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
    paddingBottom: theme.spacing.l,
  },
  ButtonStart: [
    ui.button.size.l,
    ui.button.style.solid,
    {
      marginTop: theme.spacing.m,
      marginLeft: theme.spacing.l,
      marginRight: theme.spacing.l,
      marginBottom: theme.spacing.l,
      shadowcolor: 'rgba(0, 0, 0, 0.5)',
      shadowopacity: 0.5,
      elevation: 4,
      shadowradius: 5,
      shadowoffset: { width: 1, height: 8 },
    },
  ],
  ButtonStartLabel: [ui.buttonText.size.l, ui.buttonText.style.solid],
  Link: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: theme.colors.white,
  },
  SectionNotice: {
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  TextSmall: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    marginTop: -theme.spacing.l,
  },
  SectionFB: {
    backgroundColor: theme.colors.secondary,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
  },
  ButtonFBSignIn: [ui.button.size.m, ui.button.style.outline],
  ButtonFBSignInIcon: {
    width: 22,
    height: 22,
    marginRight: theme.spacing.l,
  },
  ButtonFBSignInLabel: [ui.buttonText.size.m, ui.buttonText.style.outline],
};

export default styles;
