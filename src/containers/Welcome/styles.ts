import { ReactText } from 'react';
import { css, ReactNativeStyle } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  SectionOnboarding: css`
  margin-top:${`${theme.spacing.l}px`};
  `,
  ButtonPrimary: [
    ui.button.size.l,
    ui.button.style.primary,
    css`
      margin-top: ${`${theme.spacing.m}px`};
      margin-left: ${`${theme.spacing.l}px`};
      margin-right: ${`${theme.spacing.l}px`};
      margin-bottom: ${`${theme.spacing.s}px`};
    `,
  ],
  ButtonWhite: [
    ui.button.size.l,
    ui.button.style.solid,
    css`
      margin-top: ${`${theme.spacing.m}px`};
      margin-left: ${`${theme.spacing.l}px`};
      margin-right: ${`${theme.spacing.l}px`};
      margin-bottom: ${`${theme.spacing.s}px`};
    `,
  ],
  ButtonLabelPrimary: [ui.buttonText.size.l, 
    css`
  padding-left:${`${theme.spacing.m}px`};
  padding-right:${`${theme.spacing.m}px`};
`],
  ButtonLabelWhite: [ui.buttonText.size.wl,    
    css`
  padding-left:${`${theme.spacing.m}px`};
  padding-right:${`${theme.spacing.m}px`};
`],
  ButtonSignIn: [ui.button.size.m, ui.button.style.outline],
  ButtonSignInLabel: [
    ui.buttonText.size.m,
    ui.buttonText.style.outline
  ],
  SignInText: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.l}px`};
    font-family: ${theme.fonts.regular};
  `,
  TextSmall: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.xs}px`};
    font-family: ${theme.fonts.regular};
    text-align:center;
  `,
  Link: css`
    text-decoration-line: underline;
    color: ${theme.colors.white};
  `,
  SectionSignIn: css`
    background-color: transparent;
    padding-top: ${`${theme.spacing.m}px`};
    padding-bottom: ${`${theme.spacing.l}px`};
    border-top-width: 1px;
    border-top-color: rgba(0, 0, 0, 0.2);
  `,
  HelpSection: css`
  padding-left: ${`${theme.spacing.xl}px`};
  padding-right: ${`${theme.spacing.xl}px`};
  margin-bottom:-30px;
  `,
  HelpSectionHeading:css`
  color: ${theme.colors.white};
  font-size: ${`${theme.fontSizes.s}px`};
  font-family: ${theme.fonts.semiBold};
  text-align:center;
  `,
};

export default styles;
