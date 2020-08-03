/* Global Styles */
import styled, { css } from '@emotion/native';
import { Platform, Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');


const theme: {
  colors: {
    [key: string]: string
  },
  spacing: {
    [key: string]: number
  },
  [key: string]: {[key: string]: string | number}
  } = {
  colors: {
    primary: '#44c8e8', // Blue
    secondary: '#186078', // Dark Blue
    secondaryAlt: '#3295ad', // offBlue
    accent: '#FF9900', // Orange

    transparent: 'transparent',
    blue: '#44c8e8',
    darkBlue: '#216373',
    darkBlue2: '#186078',
    offBlue: '#3295ad',
    orange: '#FF9900',
    lightOrange: 'rgba(255,153,0, 0.7)',
    red: '#ff0000',
    white: '#fff',
    yellow: '#ffbb42',
    green: '#5abc86',
    black: '#1d1d26',
    deepBlack: '#000000',
    darkGrey: '#646464',
    grey: '#979797',
    grey2: '#DADADA',
    offWhite: '#acb1d0',
    lightGrey: '#ebebeb',
    lightGrey2: '#f1f2f2',
    lightGrey3: '#bbbbbb',
  },
  fonts: {
    regular: 'TitilliumWeb-Regular',
    semiBold: 'TitilliumWeb-SemiBold',
    bold: 'TitilliumWeb-Bold',
  },
  // Font sizes based on iOS guidelines:
  // https://learnui.design/blog/ios-font-size-guidelines.html
  fontSizes: {
    xxs: 11,
    xs: 13,
    s: 14,
    m: 15,
    l: 17,
    xl: 21,
    xxl: 24,
    xxxl: 34,
    xxxxl: 50,
  },
  spacing: {
    xxs:2,
    xs: 4,
    s: 8,
    m: 16,
    l: 22,
    xl: 44,
    xxl: 88,
  },
  radius: {
    xxs: 3,
    xs: 5,
    s: 7,
    m: 10,
    l: 12,
    xl: 18,
    xxl: 88,
  },
 /*  dimensions: {
    fullWidth: screenWidth,
    fullHeight: screenHeight,
  }, */
};

export default theme