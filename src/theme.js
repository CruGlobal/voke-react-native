import { StyleSheet } from 'react-native';
import Color from 'color';

import { exists } from './utils/common';

// See https://github.com/qix-/color for help
function colorConvert({ color, alpha, lighten, darken, negate, rotate, whiten, blacken }) {
  if (!color) console.warn('Pass in a color!');
  let col = Color(color);
  // Lots of things you can do with color stuff
  if (exists(alpha)) col = Color(col).alpha(alpha);
  if (exists(lighten)) col = Color(col).lighten(lighten);
  if (exists(darken)) col = Color(col).darken(darken);
  if (exists(negate)) col = Color(col).negate();
  if (exists(rotate)) col = Color(col).rotate(rotate);
  if (exists(whiten)) col = Color(col).whiten(whiten);
  if (exists(blacken)) col = Color(col).blacken(blacken);
  return col.rgb().toString();
}

export const COLORS = {
  BLUE: '#44c8e8',
  DARK_BLUE: '#186078',
  ORANGE: '#f96332',
  RED: '#ee2f2f',
  PINK: '#dd4499',
  GREEN: '#40ef67',
  YELLOW: '#ffdd55',
  BLACK: '#1d1d26',
  DEEP_BLACK: '#000000',
  WHITE: '#ffffff',
  OFF_WHITE: '#fdfdfe',
  GREY: '#98a6b1',
  GREY_FADE: 'rgba(152, 166, 177, 0.25)',
  WHITE_FADE: 'rgba(245, 250, 255, 0.5)',
  DARK_GREY: '#637076',
  CHARCOAL: '#434a50',
  SILVER: '#dce1e4',
  LIGHT_GREY: '#bbbbbb',
  LIGHTEST_GREY: '#ebebeb',
  TRANSPARENT: 'transparent',
  convert: colorConvert,
};

const PRIMARY = COLORS.BLUE;
const SECONDARY = COLORS.DARK_BLUE;

export default {
  // base theme
  loadingColor: COLORS.WHITE,
  primaryColor: PRIMARY,
  secondaryColor: SECONDARY,
  backgroundColor: PRIMARY,
  lightBackgroundColor: COLORS.WHITE,
  textColor: COLORS.WHITE,
  lightText: COLORS.WHITE,
  darkText: COLORS.BLACK,
  iconColor: COLORS.WHITE,
  buttonBackgroundColor: COLORS.TRANSPARENT,
  buttonBorderColor: COLORS.WHITE,
  buttonBorderWidth: 1,
  buttonTextColor: COLORS.WHITE,
  buttonIconColor: COLORS.WHITE,
  separatorColor: SECONDARY,
  separatorHeight: StyleSheet.hairlineWidth,
  // header
  headerBackgroundColor: SECONDARY,
  headerTextColor: COLORS.WHITE,
  // message
  messageHeaderTextColor: COLORS.GREEN,

};
