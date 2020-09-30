import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  StepWrapper: [
    css`
      padding-top: ${`${theme.spacing.s}px`};
    `,
  ],
  StepCard: [
    css`
      border-radius:  ${`${theme.radius.m}px`};
      overflow:hidden;
    `,
  ],
  Content: [
    css`
      padding-top: ${`${theme.spacing.s}px`};
      padding-bottom: ${`${theme.spacing.m}px`};
      padding-left: ${`${theme.spacing.m}px`};
      padding-right: ${`${theme.spacing.m}px`};
      height:100%;
    `,
  ],
};

export default styles;
