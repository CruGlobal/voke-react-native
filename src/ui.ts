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
        padding: 10px 16px;
        border-radius: ${theme.radius.m + 'px'};
      `,
    },
    style: {
      solid: css`
        background-color: ${theme.colors.primary};
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