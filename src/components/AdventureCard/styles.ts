import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  Wrapper: css`
    padding-bottom: ${`${theme.spacing.m}px`};
  `,
  Card: css`
    border-radius:  ${`${theme.radius.m}px`};
    background-color: ${theme.colors.white};
  `,
  Content: css`
    padding-top: ${`${theme.spacing.m}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
    padding-left: ${`${theme.spacing.m}px`};
    width: 100%;
    /* background-color: yellow; */
  `,
  Title: css`
    width: 100%;
    padding-right: ${`${theme.spacing.s}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
    /* background-color: red; */

    color: ${theme.colors.black};
    font-size: ${`${theme.fontSizes.xl}px`};
    font-family: ${theme.fonts.regular};
    line-height: ${theme.fontSizes.xl * 1.25 + 'px'};
    /* font-weight: 400; */
    text-align: left;
  `,
  Participants: css`
   color: ${theme.colors.secondary};
   font-size: ${`${theme.fontSizes.m}px`};
  `,
  InviteCode: css`
    opacity: .5;
    color: ${theme.colors.black};
    font-size: ${`${theme.fontSizes.s}px`};
    padding-right: ${`${theme.spacing.s}px`};
  `,
  Progress: css`
    padding-top: ${`${theme.spacing.m}px`};
  `,

};

export default styles;
