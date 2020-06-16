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
  ButtonStartLabel: [
    ui.buttonText.size.l,
    ui.buttonText.style.solid,
  ],
  Link: css`
    text-align: center;
    text-decoration-line: underline;
    color: ${theme.colors.white};
    margin-top: ${`${theme.spacing.l}px`};
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

  ButtonSignUp: [
		ui.button.size.outlinel,
		ui.button.style.outline,
	],
	ButtonSignUpLabel: [
		ui.buttonText.size.m,
		ui.buttonText.style.outline
	],
};

export default styles;
