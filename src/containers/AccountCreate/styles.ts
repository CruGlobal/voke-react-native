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
      background-color: ${theme.colors.primary};
    `,
  ],
  PrimaryContent: css`
    width: 100%;
    background-color: ${theme.colors.primary};
    padding-left: ${`${theme.spacing.xl}px`};
    padding-right: ${`${theme.spacing.xl}px`};
    margin-top:-35px;
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
    margin-top: ${`${theme.spacing.m}px`};

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
  Link: css`
    text-align: center;
    text-decoration-line: underline;
    color: ${theme.colors.white};
  `,
  ButtonStartLabel: [ui.buttonText.size.l],
  SectionNotice: css`
    padding-top: ${`${theme.spacing.m}px`};
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
    background-color: ${theme.colors.primary};
    padding-top: ${`${theme.spacing.l}px`};
    padding-bottom: ${`${theme.spacing.l}px`};
    border-top-width: 1px;
    border-top-color: rgba(0, 0, 0, 0.2);
    width: 100%;
  `,
  ButtonFBSignIn: [
    ui.button.size.outlinel,
		ui.button.style.outline,
  ],
  ButtonFBSignInLabel: [ui.buttonText.size.m],
};

export default styles;
