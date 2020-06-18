// import { ReactText } from 'react';
import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  MainContainer: [
    ui.container.default,
    css`
      flex: 1;
      background-color: ${theme.colors.secondary};
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
    background-color: ${theme.colors.secondary};
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
      shadowColor: 'rgba(0, 0, 0, 0.5)';
      shadowOpacity: 0.5;
      elevation: 4;
      shadowRadius: 5 ;
      shadowOffset : 1px 8px;
    `,
  ],
  ButtonStartLabel: [
    ui.buttonText.size.l,
    ui.buttonText.style.solid,
  ],
  Link: css`
    text-align: center;
    text-decoration-line: underline;
    color: ${theme.colors.white};
  `,
  SectionNotice: css`
    padding-left: ${`${theme.spacing.xl}px`};
    padding-right: ${`${theme.spacing.xl}px`};
    padding-bottom: ${`${theme.spacing.l}px`};
  `,
  TextSmall: css`
    color: ${theme.colors.white};
    font-size: 12px;
    font-family: ${theme.fonts.regular};
    text-align: center;
    margin-top: -${`${theme.spacing.l}px`};
  `,
  SectionFB: css`
    background-color: ${theme.colors.secondary};
    padding-top: ${`${theme.spacing.l}px`};
    padding-bottom: ${`${theme.spacing.l}px`};
    border-top-width: 1px;
    border-top-color: rgba(0, 0, 0, 0.2);
    width: 100%;
  `,
  ButtonFBSignIn: [
    ui.button.size.m,
    ui.button.style.outline,
  ],
  ButtonFBSignInIcon: [
    css`
      width: 22px;
      height: 22px;
      margin-right: ${`${theme.spacing.l}px`};
    `,
  ],
  ButtonFBSignInLabel: [
    ui.buttonText.size.m,
    ui.buttonText.style.outline
  ],
};

export default styles;
