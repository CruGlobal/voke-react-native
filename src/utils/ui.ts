/* Global Styles */
import styled, { css } from '@emotion/native';
import { Platform, Dimensions } from 'react-native';

import theme from 'utils/theme';

// const { width, height } = Dimensions.get('window');

const ui: { [key: string]: any } = {
  ...theme,
  button: {
    size: {
      m: css`
        padding: 4px 14px;
        border-radius: ${theme.radius.s + 'px'};
      `,
      l: {
        paddingVertical: 20,
        paddingHorizontal: theme.spacing.s,
        borderRadius: theme.radius.xxl,
      },
      outlinel: css`
        padding: 16px 16px;
        border-radius: ${theme.radius.m + 'px'};
      `,
    },
    style: {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      solid: css`
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
        /* color: ${theme.colors.secondary}; */
        font-size: ${theme.fontSizes.l + 'px'};
        font-family: ${theme.fonts.regular};
        text-align:center;
      `,
      l: {
        fontSize: theme.fontSizes.xl,
        lineHeight: theme.fontSizes.xl * 1.35,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
      },
      wl: css`
        /* color: ${theme.colors.secondary}; */
        font-size: ${theme.fontSizes.xl + 'px'};
        line-height: ${theme.fontSizes.xl * 1.35 + 'px'};
        font-family: ${theme.fonts.regular};
        text-align:center;
      `,
      wm: css`
        /* color: ${theme.colors.lightGrey}; */
        font-size: ${theme.fontSizes.l + 'px'};
        font-family: ${theme.fonts.semiBold};
        text-align:center;
      `,
    },
    style: {
      primary: css`
        color: ${theme.colors.white};
      `,
      solid: css`
        color: ${theme.colors.secondary};
      `,
      outline: css`
        color: ${theme.colors.white};
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
  },
};

export default ui;
