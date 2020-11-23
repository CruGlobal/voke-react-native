import { css } from '@emotion/native';
import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: any } = {
  ...ui,
  TabBarTitle: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.m}px`};
    font-family: ${theme.fonts.regular};
    padding-top: ${`${theme.spacing.s}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
  `,
};

export default styles;
