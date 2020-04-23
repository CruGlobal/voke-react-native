import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  BotContainer: css`
    padding-top: ${`${theme.spacing.m}px`};
    padding-bottom: ${`${theme.spacing.m}px`};
    width: 100%;
  `,
  BotMessage: css`
    width: 100%;
    background-color: ${theme.colors.secondaryAlt};
    padding: ${`${theme.spacing.l}px`};
    border-radius:  ${`${theme.radius.m}px`};
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
