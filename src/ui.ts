/* Global Styles */
import styled, { css } from '@emotion/native';
import { Platform, Dimensions } from 'react-native';
import theme from './theme';

// const { width, height } = Dimensions.get('window');

const ui: { [key: string]: any } = {
  ...theme,
  button: {
    size: {
      m: css`
        padding: 4px 14px;
        border-radius: ${theme.radius.s + 'px'};
      `,
      l: css`
        padding: 20px 16px;
        border-radius: ${theme.radius.xxl + 'px'};
      `,
      outlinel: css`
        padding: 16px 16px;
        border-radius: ${theme.radius.m + 'px'};
      `,
    },
    style: {
      fillPrimary: css`
        background-color: ${theme.colors.primary};
      `,
      fillWhite: css`
      background-color: ${theme.colors.white};
    `,
      outline: css`
        border: solid 1px ${theme.colors.white};
      `,
    },
  },
  buttonText: {
    size: {
      m: css`
        color: ${theme.colors.white};
        font-size: ${theme.fontSizes.l + 'px'};
        font-family: ${theme.fonts.regular};
        text-align:center;
      `,
      l: css`
        color: ${theme.colors.white};
        font-size: ${theme.fontSizes.xl + 'px'};
        line-height: ${theme.fontSizes.xl * 1.35 + 'px'};
        font-family: ${theme.fonts.regular};
        text-align:center;
      `,
      wl: css`
        color: ${theme.colors.secondary};
        font-size: ${theme.fontSizes.xl + 'px'};
        line-height: ${theme.fontSizes.xl * 1.35 + 'px'};
        font-family: ${theme.fonts.regular};
        text-align:center;
      `,
      wm: css`
      color: ${theme.colors.lightGrey};
      font-size: ${theme.fontSizes.l + 'px'};
      font-family: ${theme.fonts.semiBold};
      text-align:center;
    `,
    },
  },
  container: {
    default: css`
      align-items: center;
      justify-content: space-between;
      background-color: ${theme.colors.primary};
      width: 100%;
    `,
  }
};

export default ui
