import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...theme,
  NextActionContainer: css`
    padding-top: ${`${theme.spacing.m}px`};
    padding-bottom: ${`${theme.spacing.m}px`};
    padding-left: ${`${theme.spacing.xl}px`};
    padding-right: ${`${theme.spacing.xl}px`};
  `,
  NextActionButton: [
    ui.button.size.l,
    ui.button.style.solid,
    css`
      background-color: ${theme.colors.secondary};
    `,
  ],
  ButtonActive: [
    css`
      background-color: ${theme.colors.accent};
    `,
  ],
  NextActionButtonLabel: [ui.buttonText.size.l],
};

export default styles;
