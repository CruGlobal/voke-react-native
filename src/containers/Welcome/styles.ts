import { ReactText } from 'react';
import { css, ReactNativeStyle } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  SectionOnboarding: css`
    background-color: ${theme.colors.blue};
  `,
  Slide: css`
		padding-top:${`${theme.spacing.xl}px`};
		padding-right:${`${theme.spacing.m}px`};
		padding-left:${`${theme.spacing.m}px`};
  `,
  SliderTitle: css`
    font-family: ${theme.fonts.bold};
    font-size: ${`${theme.fontSizes.xxxl}px`};
    color: ${theme.colors.white};
  `,
  // [st.pt6, st.fs16, st.white, st.tac, st.ph2]
  SliderDescription: css`
		/* font-family: ${theme.fonts.regular}; */
		font-size: ${`${theme.fontSizes.l}px`};
		text-align: center;
		color: ${theme.colors.white};
		padding-top:${`${theme.spacing.s}px`};
		padding-bottom:${`${theme.spacing.m}px`};
	`,
  DotStyle: css`
    width: 10px;
    height: 10px;
    margin-left: 0;
    margin-right: 0;
    border-radius: ${`${theme.radius.m}px`};
    /* margin-top: 30px; */
  `,
  SectionAction: css`
    background-color: ${theme.colors.secondary};
		padding-top:${`${theme.spacing.s}px`};
		padding-bottom:${`${theme.spacing.l}px`};
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
  ButtonStartLabel: [ui.buttonText.size.l],
  ButtonSignIn: [ui.button.size.m, ui.button.style.outline],
  ButtonSignInLabel: [ui.buttonText.size.m],
  SignInText: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.l}px`};
    font-family: ${theme.fonts.regular};
  `,
  TextSmall: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.s}px`};
    font-family: ${theme.fonts.regular};
  `,
  Link: css`
    text-decoration-line: underline;
    color: ${theme.colors.white};
  `,
  SectionSignIn: css`
    background-color: ${theme.colors.secondary};
    padding-top: ${`${theme.spacing.m}px`};
    padding-bottom: ${`${theme.spacing.l}px`};
    border-top-width: 1px;
    border-top-color: rgba(0, 0, 0, 0.2);
  `,
};

export default styles;
