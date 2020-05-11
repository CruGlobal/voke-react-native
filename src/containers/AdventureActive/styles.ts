import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  ListOfSteps: css`
    padding-top: ${`${theme.spacing.l}px`};
    padding-bottom: ${`${theme.spacing.l}px`};
    padding-left:${theme.spacing.m + 'px'};
		padding-right:${theme.spacing.m + 'px'};
  `,
};

export default styles;
