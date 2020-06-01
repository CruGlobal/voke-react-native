import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  BotContainer: css`
    padding-bottom: ${`${theme.spacing.m}px`};
    width: 90%;
    margin: auto;
    margin-top: ${`${theme.spacing.m}px`};

  `,
  BotMessage: css`
    width: 100%;
    background-color: ${theme.colors.secondary};
    padding: ${`${theme.spacing.s}px`};
    border-radius:  ${`${theme.radius.m}px`};
  `,
  BotHeading: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.xl}px`};
    font-family: ${theme.fonts.semiBold};
    text-align: center;
  `,
  BotText: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.l}px`};
    font-family: ${theme.fonts.regular};
    text-align: center;
  `,
  BotImage: css`
    margin-left: -70px;
    margin-top:-15px;
  `,
  BotMessageTail: css`
    margin-left: 50px;
    margin-top: -10px;
    transform: rotate(-90deg);
  `,
  BotMessage_reverse: css`
  width: 80%;
  background-color: ${theme.colors.white};
  padding: ${`${theme.spacing.l}px`};
  border-radius:  ${`${theme.radius.m}px`};
`,
BotText_reverse: css`
    color: ${theme.colors.secondaryAlt};
    font-size: ${`${theme.fontSizes.xl}px`};
    font-family: ${theme.fonts.regular};
    text-align: center;
  `,
  BotImage_reverse: css`
    margin-left: -30px;
  `, 
};

export default styles;
