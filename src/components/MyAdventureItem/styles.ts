import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  MyAdventureWrapper: css`
    padding-top: ${`${theme.spacing.s}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
  `,
  MyAdventureBlock: css`
    border-radius:  ${`${theme.radius.m}px`};
  `,
  MyAdventureBlockActive: css`
    background-color: ${theme.colors.white};
  `,
  MyAdventureBlockInvite: css`
    background-color: ${theme.colors.secondary};
  `,

};

export default styles;
