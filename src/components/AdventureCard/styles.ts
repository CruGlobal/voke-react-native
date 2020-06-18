import { css } from '@emotion/native';
import theme from '../../theme';
import ui from '../../ui';

const styles: { [key: string]: any } = {
  ...ui,
  Wrapper: css`
    padding-bottom: ${`${theme.spacing.s}px`};
  `,
  Card: css`
    border-radius:  ${`${theme.radius.s}px`};
    background-color: ${theme.colors.white};
  `,
  Content: css`
    padding-top: ${`${theme.spacing.m}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
    padding-left: ${`${theme.spacing.m}px`};
    width: 100%;
  `,
  Title: css`
    width: 100%;
    padding-right: ${`${theme.spacing.s}px`};
    padding-bottom: ${`${theme.spacing.s}px`};
    /* background-color: red; */

    color: ${theme.colors.darkGrey};
    font-size: ${`${theme.fontSizes.l}px`};
    font-family: ${theme.fonts.regular};
    line-height: ${theme.fontSizes.xl * 1.25 + 'px'};
    /* font-weight: 400; */
    text-align: left;
  `,
  Participants: css`
   color: ${theme.colors.secondary};
   font-size: ${`${theme.fontSizes.m}px`};
  `,
  SoloTag: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.s}px`};
    padding: ${`${theme.spacing.xxs}px ${theme.spacing.s}px`};
    background-color:${theme.colors.secondaryAlt};
    margin-bottom: -5%;
    margin-right:10px;
  `,
  DuoTag: css`
    color: ${theme.colors.white};
    font-size: ${`${theme.fontSizes.s}px`};
    padding: ${`${theme.spacing.xxs}px ${theme.spacing.s}px`};
    background-color:${theme.colors.secondary};
    margin-bottom: -5%;
    margin-right:10px;
  `,
  GroupTag: css`
  color: ${theme.colors.white};
  font-size: ${`${theme.fontSizes.s}px`};
  padding: ${`${theme.spacing.xxs}px ${theme.spacing.s}px`};
  background-color: #EC5569 ;
  margin-bottom: -5%;
  margin-right:10px;
`,
  Progress: css`
    padding-top: ${`${theme.spacing.m}px`};
  `,

};

export default styles;
