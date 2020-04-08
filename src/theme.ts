/* Global Styles */
import styled, { css } from '@emotion/native';
import { Platform, Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');

const theme: { [key: string]: {[key: string]: string | number} } = {
  colors: {
    transparent: 'transparent',
    blue: '#44c8e8',
    darkBlue: '#216373',
    darkBlue2: '#186078',
    offBlue: '#3295ad',
    orange: '#FF9900',
    lightOrange: 'rgba(255,153,0, 0.7)',
    red: '#ee2f2f',
    white: '#fff',
    yellow: '#ffbb42',
    green: '#5abc86',
    black: '#1d1d26',
    deepBlack: '#000000',
    darkGrey: '#646464',
    grey: '#979797',
    grey2: '#a1a1a1',
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
    xxs: 10,
    xs: 12,
    s: 13,
    m: 15,
    l: 17,
    xl: 21,
    xxl: 24,
    xxxl: 34,
    xxxxl: 50,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 22,
    xl: 44,
    xxl: 88,
  },
  radius: {
    xs: 5,
    s: 7,
    m: 10,
    l: 12,
    // xl: 44,
    // xxl: 88,
  },
 /*  dimensions: {
    fullWidth: screenWidth,
    fullHeight: screenHeight,
  }, */
};

export default theme