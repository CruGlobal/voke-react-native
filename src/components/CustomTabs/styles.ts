import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  TabBarTitle: css`
    color: ${theme.colors.secondary};
    font-size: ${`${theme.fontSizes.m}px`};
    font-family: ${theme.fonts.regular};
    padding-top: ${`${theme.spacing.s}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
  `,
};

export default styles;
