import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  AdventuresList: css`
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.primary};
    padding-top: ${`${theme.spacing.s}px`};
    padding-left:${theme.spacing.m + 'px'};
		padding-right:${theme.spacing.m + 'px'};
  `,
  Heading: css`
    color: ${theme.colors.secondary};
    font-size: ${`${theme.fontSizes.m}px`};
    font-family: ${theme.fonts.regular};
    font-weight: 600;
    text-transform: uppercase;
    padding-top: ${`${theme.spacing.m}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
  `,
  BotText: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.xl}px`};
    font-family: ${theme.fonts.regular};
    text-align: center;
  `,
  BotImage: css`
    margin-left: -30px;
  `,
  BotMessageTail: css`
    margin-left: 30px;
    margin-top: -10px;
    transform: rotate(-90deg);
  `,
};

export default styles;
