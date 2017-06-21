import Color from 'color';

// See https://github.com/qix-/color for help
function colorConvert({ color, alpha, lighten, darken, negate, rotate, whiten, blacken }) {
  let col = Color(color);
  // Lots of things you can do with color stuff
  if (typeof alpha !== 'undefined') col = Color(col).alpha(alpha);
  if (typeof lighten !== 'undefined') col = Color(col).lighten(lighten);
  if (typeof darken !== 'undefined') col = Color(col).darken(darken);
  if (typeof negate !== 'undefined') col = Color(col).negate();
  if (typeof rotate !== 'undefined') col = Color(col).rotate(rotate);
  if (typeof whiten !== 'undefined') col = Color(col).whiten(whiten);
  if (typeof blacken !== 'undefined') col = Color(col).blacken(blacken);
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

export default {
  // base theme
  backgroundColor: COLORS.BLUE,
  lightBackgroundColor: COLORS.LIGHTEST_GREY,
  secondaryColor: COLORS.DARK_BLUE,
  textColor: COLORS.WHITE,
  darkText: COLORS.BLACK,
  iconColor: COLORS.WHITE,
  buttonBackgroundColor: COLORS.TRANSPARENT,
  buttonBorderColor: COLORS.WHITE,
  buttonBorderWidth: 1,
  buttonTextColor: COLORS.WHITE,
  buttonIconColor: COLORS.WHITE,
  separatorColor: COLORS.DARK_BLUE,
  separatorHeight: 0.5,
  // header
  headerBackgroundColor: COLORS.DARK_BLUE,
  headerTextColor: COLORS.WHITE,
  // message
  messageHeaderTextColor: COLORS.GREEN,

};
