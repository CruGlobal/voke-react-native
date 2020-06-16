import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  BotContainer: css`
    width: 90%;
    margin: auto;
    margin-top: ${`${theme.spacing.m}px`};
    padding-bottom: ${`${theme.spacing.m}px`};    
  `,
  BotMessage: css`
    width: 100%;
    background-color: ${theme.colors.secondary};
    padding: ${`${theme.spacing.s}px`};
    border-radius:  ${`${theme.radius.m}px`};
    padding-bottom: 12px;
  `,
  BotHeading: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.xl}px`};
    font-family: ${theme.fonts.semiBold};
    text-align: center;
  `,
  BotHeading_overlay: css`
  color: ${theme.colors.secondaryAlt};
  font-size: ${`${theme.fontSizes.xl}px`};
  font-family: ${theme.fonts.semiBold};
  text-align: center;
`,
  BotText: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.xl}px`};
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
    z-index:-1;
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
  BotMessage_overlay: css`
  width: 90%;
  background-color: ${theme.colors.white};
  padding: ${`${theme.spacing.s}px`};
  border-radius:  ${`${theme.radius.m}px`};
  margin:auto;
  margin-top:40px;
`,
BotImage_overlay: css`
margin-left: -85px;
margin-top:-25px;
`,

};

export default styles;
