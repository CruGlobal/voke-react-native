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
    marginTop: -35,
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
    marginTop: theme.spacing.m,
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
  Link: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: theme.colors.white,
  },
  ButtonStartLabel: [ui.buttonText.size.l],
  SectionNotice: {
    paddingTop: theme.spacing.m,
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
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.l,

    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
  },
  ButtonFBSignIn: [ui.button.size.outlinel, ui.button.style.outline],
  ButtonFBSignInLabel: [ui.buttonText.size.m],
};

export default styles;
