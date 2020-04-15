import {ReactText} from 'react';
import { css, ReactNativeStyle } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
	...ui,
	SectionOnboarding: css`
		background-color: ${theme.colors.blue};
	`,
	SectionAction: css`
		background-color: ${theme.colors.darkBlue};
		padding-left:${theme.spacing.xl + 'px'};
		padding-right:${theme.spacing.xl + 'px'};
	`,
	ButtonStart: [
		ui.button.size.l,
		ui.button.style.solid,
		css`
			margin-left:${theme.spacing.l + 'px'};
			margin-right:${theme.spacing.l + 'px'};
		`,
	],
	ButtonStartLabel: [
		ui.buttonText.size.l
	],
	ButtonSignIn: [
		ui.button.size.m,
		ui.button.style.outline
	],
	ButtonSignInLabel: [
		ui.buttonText.size.m
	],
	SignInText: css`
		color: ${theme.colors.white};
		font-size: ${theme.fontSizes.l + 'px'};
		font-family: ${theme.fonts.regular};
	`,
	TextSmall: css`
		color: ${theme.colors.white};
		font-size:12px;
		font-family: ${theme.fonts.regular};
	`,
	Link: css`
		text-decoration-line: underline;
		color: ${theme.colors.white};
	`,
	SectionSignIn: css`
		background-color: ${theme.colors.darkBlue};
		padding-bottom:${theme.spacing.xl + 'px'};
	`,
}


export default styles