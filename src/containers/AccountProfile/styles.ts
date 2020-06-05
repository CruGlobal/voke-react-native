import {ReactText} from 'react';
import { css, ReactNativeStyle } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
	...theme,
	SectionOnboarding: css`
		background-color: ${theme.colors.primary};
	`,
	SectionAction: css`
		background-color: ${theme.colors.primary};
		padding-left:${theme.spacing.xl + 'px'};
		padding-right:${theme.spacing.xl + 'px'};
		padding-bottom:${theme.spacing.m + 'px'};
	`,
	ButtonStart: [
		ui.button.size.l,
		ui.button.style.solid,
		css`
			margin-top:${theme.spacing.m + 'px'};
			margin-left:${theme.spacing.l + 'px'};
			margin-right:${theme.spacing.l + 'px'};
			margin-bottom:${theme.spacing.l + 'px'};
		`,
	],
	ButtonStartLabel: [
		ui.buttonText.size.l
	],
	ButtonSignUp: [
		ui.button.size.outlinel,
		ui.button.style.outline,
		
	],
	ButtonSignUpLabel: [
		ui.buttonText.size.m
	],
	ButtonAction: [
		ui.button.size.m,
		ui.button.style.outline,
	],
	ButtonActionLabel: [
		ui.buttonText.size.m
	],
	SignInText: css`
		color: ${theme.colors.white};
		font-size: ${theme.fontSizes.m + 'px'};
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
		background-color: ${theme.colors.primary};
		padding-top:${theme.spacing.m + 'px'};
		padding-bottom:${theme.spacing.xl + 'px'};
	`,
}


export default styles