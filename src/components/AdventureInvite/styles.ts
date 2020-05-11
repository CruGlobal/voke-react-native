import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  InviteWrapper: css`
    padding-top: ${`${theme.spacing.s}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
  `,
  InviteBlock: css`
    border-radius:  ${`${theme.radius.m}px`};
    background-color: ${theme.colors.secondary};
    min-height: 100;
  `,
  InviteBlockContent: css`
    padding-top: ${theme.spacing.s + 'px'};
    padding-bottom: ${theme.spacing.s + 'px'};
    padding-left: ${theme.spacing.m + 'px'};
    padding-right: ${theme.spacing.m + 'px'};
    min-height: 90;
  `,
  CodeBlock: [
    ui.button.size.m,
    css`
      padding-left: 0;
    `,
  ],
  Code: [
    css`
      font-size: ${theme.fontSizes.m + 'px'};
      color: ${theme.colors.white};
    `,
  ],
  ButtonReset: [
    ui.button.size.m,
    ui.button.style.solid,
    css`
      border-radius: ${theme.radius.xl + 'px'};
      background-color: ${theme.colors.accent};
    `,
  ],
  ButtonResetLabel: [ui.buttonText.size.s],

};

export default styles;
