import { ReactText } from 'react';
import { css, ReactNativeStyle } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  MainContainer: [
    ui.container.default,
    css`
      flex: 1;
      background-color: ${theme.colors.primary};
    `,
  ],
  PrimaryContent: css`
    width: 100%;
    background-color: ${theme.colors.primary};
    padding-left: ${`${theme.spacing.xl}px`};
    padding-right: ${`${theme.spacing.xl}px`};
  `,
  Divider: css`
    width: 100%;
    background-color: ${theme.colors.primary};
  `,
  SectionAction: css`
    width: 100%;
    background-color: ${theme.colors.primary};
    padding-left: ${`${theme.spacing.xl}px`};
    padding-right: ${`${theme.spacing.xl}px`};
    padding-bottom: ${`${theme.spacing.l}px`};
  `,
  ButtonStart: [
    ui.button.size.l,
    ui.button.style.solid,
    css`
      margin-top: ${`${theme.spacing.m}px`};
      margin-left: ${`${theme.spacing.l}px`};
      margin-right: ${`${theme.spacing.l}px`};
      margin-bottom: ${`${theme.spacing.l}px`};
    `,
  ],
  ButtonStartLabel: [ui.buttonText.size.l, ui.buttonText.style.solid],
  ButtonSignIn: [ui.button.size.m, ui.button.style.outline],
  ButtonSignInLabel: [ui.buttonText.size.m, ui.buttonText.style.outline],
  SignInText: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.l}px`};
    font-family: ${theme.fonts.regular};
  `,
  TextSmall: css`
    color: ${theme.colors.white};
    font-size: 12px;
    font-family: ${theme.fonts.regular};
  `,
  TextLarge: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.l}px`};
    font-family: ${theme.fonts.regular};
    padding-right: ${`${theme.spacing.m}px`};
    padding-left: ${`${theme.spacing.m}px`};
  `,
  Link: css`
    text-decoration-line: underline;
    color: ${theme.colors.white};
  `,
  SectionSignIn: css`
    background-color: ${theme.colors.primary};
    padding-bottom: ${`${theme.spacing.xl}px`};
  `,
};

export default styles;
