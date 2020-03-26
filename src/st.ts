import { Platform, Dimensions } from 'react-native';
const isAndroid = Platform.OS === 'android';
const fontFamilyMain = 'TitilliumWeb-Regular';
const fontFamilyMainSemiBold = 'TitilliumWeb-SemiBold';
const fontFamilyMainBold = 'TitilliumWeb-Bold';

const colors: { [key: string]: string } = {
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
};

// Generate { color: ..., bgColor: ...} style object
const generatedColors = Object.keys(colors).reduce((p: {}, key: string) => {
  const value = colors[key];
  const pascalCase = key.charAt(0).toUpperCase() + key.slice(1);
  return {
    ...p,
    [`bg${pascalCase}`]: { backgroundColor: value },
    [`border${pascalCase}`]: { borderColor: value },
    [`br${pascalCase}`]: { borderRightColor: value },
    [`bl${pascalCase}`]: { borderLeftColor: value },
    [`bt${pascalCase}`]: { borderTopColor: value },
    [`bb${pascalCase}`]: { borderBottomColor: value },
    [key]: { color: value },
  };
}, {});

const { width, height } = Dimensions.get('window');

// Default styles

const generateFn = (prefix: string, value: string) => ({
  [prefix]: (n: string | number) => ({ [value]: n }),
});
const generate = (prefix: string, value: string, arr: any[], calc?: Function) =>
  arr.reduce(
    (p: object, n: any, i: number) => ({
      ...p,
      [`${prefix}${calc ? n : i}`]: { [value]: calc ? calc(n) : n },
    }),
    generateFn(prefix, value),
  );

// pd0, pd1, ..., pd6, pd7
const sizes = [0, 50, 30, 25, 15, 10, 5, 2];
const generateSizes = (p: string, v: string) => generate(p, v, sizes);

// w0, w10, ..., w100
const percentages = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100];
const generatePercentages = (p: string, v: string, calc: Function) =>
  generate(p, v, percentages, calc);

// zi0, zi1, ..., zi5
const nums = [0, 1, 2, 3, 4, 5];
const generateNums = (p: string, v: string) => generate(p, v, nums);

function hexToRGB(hex: string, alpha: any, property: any) {
  const parse = (c: string) => parseInt(c, 16);
  const r = parse(hex.slice(1, 3));
  const g = parse(hex.slice(3, 5));
  const b = parse(hex.slice(5, 7));
  const str = `'rgba(${r},${g},${b},${alpha})'`;
  if (property) {
    return { [property]: str };
  }
  return str;
}

type CalculatedTypes = {
  // PERCENTAGES
  op0: string | number;
  op5: string | number;
  op10: string | number;
  op20: string | number;
  op25: string | number;
  op30: string | number;
  op40: string | number;
  op50: string | number;
  op60: string | number;
  op70: string | number;
  op75: string | number;
  op80: string | number;
  op90: string | number;
  op95: string | number;
  op100: string | number;
  w0: string | number;
  w5: string | number;
  w10: string | number;
  w20: string | number;
  w25: string | number;
  w30: string | number;
  w40: string | number;
  w50: string | number;
  w60: string | number;
  w70: string | number;
  w75: string | number;
  w80: string | number;
  w90: string | number;
  w95: string | number;
  w100: string | number;
  minw0: string | number;
  minw5: string | number;
  minw10: string | number;
  minw20: string | number;
  minw25: string | number;
  minw30: string | number;
  minw40: string | number;
  minw50: string | number;
  minw60: string | number;
  minw70: string | number;
  minw75: string | number;
  minw80: string | number;
  minw90: string | number;
  minw95: string | number;
  minw100: string | number;
  maxw0: string | number;
  maxw5: string | number;
  maxw10: string | number;
  maxw20: string | number;
  maxw25: string | number;
  maxw30: string | number;
  maxw40: string | number;
  maxw50: string | number;
  maxw60: string | number;
  maxw70: string | number;
  maxw75: string | number;
  maxw80: string | number;
  maxw90: string | number;
  maxw95: string | number;
  maxw100: string | number;
  fw0: string | number;
  fw5: string | number;
  fw10: string | number;
  fw20: string | number;
  fw25: string | number;
  fw30: string | number;
  fw40: string | number;
  fw50: string | number;
  fw60: string | number;
  fw70: string | number;
  fw75: string | number;
  fw80: string | number;
  fw90: string | number;
  fw95: string | number;
  fw100: string | number;
  minfw0: string | number;
  minfw5: string | number;
  minfw10: string | number;
  minfw20: string | number;
  minfw25: string | number;
  minfw30: string | number;
  minfw40: string | number;
  minfw50: string | number;
  minfw60: string | number;
  minfw70: string | number;
  minfw75: string | number;
  minfw80: string | number;
  minfw90: string | number;
  minfw95: string | number;
  minfw100: string | number;
  maxfw0: string | number;
  maxfw5: string | number;
  maxfw10: string | number;
  maxfw20: string | number;
  maxfw25: string | number;
  maxfw30: string | number;
  maxfw40: string | number;
  maxfw50: string | number;
  maxfw60: string | number;
  maxfw70: string | number;
  maxfw75: string | number;
  maxfw80: string | number;
  maxfw90: string | number;
  maxfw95: string | number;
  maxfw100: string | number;
  h0: string | number;
  h5: string | number;
  h10: string | number;
  h20: string | number;
  h25: string | number;
  h30: string | number;
  h40: string | number;
  h50: string | number;
  h60: string | number;
  h70: string | number;
  h75: string | number;
  h80: string | number;
  h90: string | number;
  h95: string | number;
  h100: string | number;
  minh0: string | number;
  minh5: string | number;
  minh10: string | number;
  minh20: string | number;
  minh25: string | number;
  minh30: string | number;
  minh40: string | number;
  minh50: string | number;
  minh60: string | number;
  minh70: string | number;
  minh75: string | number;
  minh80: string | number;
  minh90: string | number;
  minh95: string | number;
  minh100: string | number;
  maxh0: string | number;
  maxh5: string | number;
  maxh10: string | number;
  maxh20: string | number;
  maxh25: string | number;
  maxh30: string | number;
  maxh40: string | number;
  maxh50: string | number;
  maxh60: string | number;
  maxh70: string | number;
  maxh75: string | number;
  maxh80: string | number;
  maxh90: string | number;
  maxh95: string | number;
  maxh100: string | number;
  fh0: string | number;
  fh5: string | number;
  fh10: string | number;
  fh20: string | number;
  fh25: string | number;
  fh30: string | number;
  fh40: string | number;
  fh50: string | number;
  fh60: string | number;
  fh70: string | number;
  fh75: string | number;
  fh80: string | number;
  fh90: string | number;
  fh95: string | number;
  fh100: string | number;
  minfh0: string | number;
  minfh5: string | number;
  minfh10: string | number;
  minfh20: string | number;
  minfh25: string | number;
  minfh30: string | number;
  minfh40: string | number;
  minfh50: string | number;
  minfh60: string | number;
  minfh70: string | number;
  minfh75: string | number;
  minfh80: string | number;
  minfh90: string | number;
  minfh95: string | number;
  minfh100: string | number;
  maxfh0: string | number;
  maxfh5: string | number;
  maxfh10: string | number;
  maxfh20: string | number;
  maxfh25: string | number;
  maxfh30: string | number;
  maxfh40: string | number;
  maxfh50: string | number;
  maxfh60: string | number;
  maxfh70: string | number;
  maxfh75: string | number;
  maxfh80: string | number;
  maxfh90: string | number;
  maxfh95: string | number;
  maxfh100: string | number;
  // SIZES
  br0: 0;
  br1: 50;
  br2: 30;
  br3: 25;
  br4: 15;
  br5: 10;
  br6: 5;
  br7: 2;
  brtr0: 0;
  brtr1: 50;
  brtr2: 30;
  brtr3: 25;
  brtr4: 15;
  brtr5: 10;
  brtr6: 5;
  brtr7: 2;
  brtl0: 0;
  brtl1: 50;
  brtl2: 30;
  brtl3: 25;
  brtl4: 15;
  brtl5: 10;
  brtl6: 5;
  brtl7: 2;
  brbr0: 0;
  brbr1: 50;
  brbr2: 30;
  brbr3: 25;
  brbr4: 15;
  brbr5: 10;
  brbr6: 5;
  brbr7: 2;
  brbl0: 0;
  brbl1: 50;
  brbl2: 30;
  brbl3: 25;
  brbl4: 15;
  brbl5: 10;
  brbl6: 5;
  brbl7: 2;
  p0: 0;
  p1: 50;
  p2: 30;
  p3: 25;
  p4: 15;
  p5: 10;
  p6: 5;
  p7: 2;
  pd0: 0;
  pd1: 50;
  pd2: 30;
  pd3: 25;
  pd4: 15;
  pd5: 10;
  pd6: 5;
  pd7: 2;
  ph0: 0;
  ph1: 50;
  ph2: 30;
  ph3: 25;
  ph4: 15;
  ph5: 10;
  ph6: 5;
  ph7: 2;
  pv0: 0;
  pv1: 50;
  pv2: 30;
  pv3: 25;
  pv4: 15;
  pv5: 10;
  pv6: 5;
  pv7: 2;
  pt0: 0;
  pt1: 50;
  pt2: 30;
  pt3: 25;
  pt4: 15;
  pt5: 10;
  pt6: 5;
  pt7: 2;
  pb0: 0;
  pb1: 50;
  pb2: 30;
  pb3: 25;
  pb4: 15;
  pb5: 10;
  pb6: 5;
  pb7: 2;
  pl0: 0;
  pl1: 50;
  pl2: 30;
  pl3: 25;
  pl4: 15;
  pl5: 10;
  pl6: 5;
  pl7: 2;
  pr0: 0;
  pr1: 50;
  pr2: 30;
  pr3: 25;
  pr4: 15;
  pr5: 10;
  pr6: 5;
  pr7: 2;
  m0: 0;
  m1: 50;
  m2: 30;
  m3: 25;
  m4: 15;
  m5: 10;
  m6: 5;
  m7: 2;
  mh0: 0;
  mh1: 50;
  mh2: 30;
  mh3: 25;
  mh4: 15;
  mh5: 10;
  mh6: 5;
  mh7: 2;
  mv0: 0;
  mv1: 50;
  mv2: 30;
  mv3: 25;
  mv4: 15;
  mv5: 10;
  mv6: 5;
  mv7: 2;
  mt0: 0;
  mt1: 50;
  mt2: 30;
  mt3: 25;
  mt4: 15;
  mt5: 10;
  mt6: 5;
  mt7: 2;
  mb0: 0;
  mb1: 50;
  mb2: 30;
  mb3: 25;
  mb4: 15;
  mb5: 10;
  mb6: 5;
  mb7: 2;
  ml0: 0;
  ml1: 50;
  ml2: 30;
  ml3: 25;
  ml4: 15;
  ml5: 10;
  ml6: 5;
  ml7: 2;
  mr0: 0;
  mr1: 50;
  mr2: 30;
  mr3: 25;
  mr4: 15;
  mr5: 10;
  mr6: 5;
  mr7: 2;
  // NUMBERS
  bw0: 0;
  bw1: 1;
  bw2: 2;
  bw3: 3;
  bw4: 4;
  bw5: 5;
  btw0: 0;
  btw1: 1;
  btw2: 2;
  btw3: 3;
  btw4: 4;
  btw5: 5;
  bbw0: 0;
  bbw1: 1;
  bbw2: 2;
  bbw3: 3;
  bbw4: 4;
  bbw5: 5;
  blw0: 0;
  blw1: 1;
  blw2: 2;
  blw3: 3;
  blw4: 4;
  blw5: 5;
  brw0: 0;
  brw1: 1;
  brw2: 2;
  brw3: 3;
  brw4: 4;
  brw5: 5;
  zi0: 0;
  zi1: 1;
  zi2: 2;
  zi3: 3;
  zi4: 4;
  zi5: 5;
  ls0: 0;
  ls1: 1;
  ls2: 2;
  ls3: 3;
  ls4: 4;
  ls5: 5;
  lh0: 0;
  lh1: 1;
  lh2: 2;
  lh3: 3;
  lh4: 4;
  lh5: 5;
  f0: 0;
  f1: 1;
  f2: 2;
  f3: 3;
  f4: 4;
  f5: 5;
  // COLORS
  lightestGrey: { color: string };
  bgLightestGrey: { backgroundColor: string };
  borderLightestGrey: { borderColor: string };
  brLightestGrey: { borderRightColor: string };
  blLightestGrey: { borderLeftColor: string };
  btLightestGrey: { borderTopColor: string };
  bbLightestGrey: { borderBottomColor: string };
  lightestGrey3: { color: string };
  bgLightestGrey3: { backgroundColor: string };
  borderLightestGrey3: { borderColor: string };
  brLightestGrey3: { borderRightColor: string };
  blLightestGrey3: { borderLeftColor: string };
  btLightestGrey3: { borderTopColor: string };
  bbLightestGrey3: { borderBottomColor: string };
  lightestGrey2: { color: string };
  bgLightestGrey2: { backgroundColor: string };
  borderLightestGrey2: { borderColor: string };
  brLightestGrey2: { borderRightColor: string };
  blLightestGrey2: { borderLeftColor: string };
  btLightestGrey2: { borderTopColor: string };
  bbLightestGrey2: { borderBottomColor: string };
  transparent: { color: string };
  bgTransparent: { backgroundColor: string };
  borderTransparent: { borderColor: string };
  brTransparent: { borderRightColor: string };
  blTransparent: { borderLeftColor: string };
  btTransparent: { borderTopColor: string };
  bbTransparent: { borderBottomColor: string };
  lightBlue: { color: string };
  bgLightBlue: { backgroundColor: string };
  borderLightBlue: { borderColor: string };
  brLightBlue: { borderRightColor: string };
  blLightBlue: { borderLeftColor: string };
  btLightBlue: { borderTopColor: string };
  bbLightBlue: { borderBottomColor: string };
  blue: { color: string };
  bgBlue: { backgroundColor: string };
  borderBlue: { borderColor: string };
  brBlue: { borderRightColor: string };
  blBlue: { borderLeftColor: string };
  btBlue: { borderTopColor: string };
  bbBlue: { borderBottomColor: string };
  notificationBlue: { color: string };
  bgNotificationBlue: { backgroundColor: string };
  borderNotificationBlue: { borderColor: string };
  brNotificationBlue: { borderRightColor: string };
  blNotificationBlue: { borderLeftColor: string };
  btNotificationBlue: { borderTopColor: string };
  bbNotificationBlue: { borderBottomColor: string };
  darkBlue: { color: string };
  bgDarkBlue: { backgroundColor: string };
  borderDarkBlue: { borderColor: string };
  brDarkBlue: { borderRightColor: string };
  blDarkBlue: { borderLeftColor: string };
  btDarkBlue: { borderTopColor: string };
  bbDarkBlue: { borderBottomColor: string };
  darkestBlue: { color: string };
  bgDarkestBlue: { backgroundColor: string };
  borderDarkestBlue: { borderColor: string };
  brDarkestBlue: { borderRightColor: string };
  blDarkestBlue: { borderLeftColor: string };
  btDarkestBlue: { borderTopColor: string };
  bbDarkestBlue: { borderBottomColor: string };
  purple: { color: string };
  bgPurple: { backgroundColor: string };
  borderPurple: { borderColor: string };
  brPurple: { borderRightColor: string };
  blPurple: { borderLeftColor: string };
  btPurple: { borderTopColor: string };
  bbPurple: { borderBottomColor: string };
  darkPurple: { color: string };
  bgDarkPurple: { backgroundColor: string };
  borderDarkPurple: { borderColor: string };
  brDarkPurple: { borderRightColor: string };
  blDarkPurple: { borderLeftColor: string };
  btDarkPurple: { borderTopColor: string };
  bbDarkPurple: { borderBottomColor: string };
  pink: { color: string };
  bgPink: { backgroundColor: string };
  borderPink: { borderColor: string };
  brPink: { borderRightColor: string };
  blPink: { borderLeftColor: string };
  btPink: { borderTopColor: string };
  bbPink: { borderBottomColor: string };
  pinkLight: { color: string };
  bgPinkLight: { backgroundColor: string };
  borderPinkLight: { borderColor: string };
  brPinkLight: { borderRightColor: string };
  blPinkLight: { borderLeftColor: string };
  btPinkLight: { borderTopColor: string };
  bbPinkLight: { borderBottomColor: string };
  orange: { color: string };
  bgOrange: { backgroundColor: string };
  borderOrange: { borderColor: string };
  brOrange: { borderRightColor: string };
  blOrange: { borderLeftColor: string };
  btOrange: { borderTopColor: string };
  bbOrange: { borderBottomColor: string };
  darkOrange: { color: string };
  bgDarkOrange: { backgroundColor: string };
  borderDarkOrange: { borderColor: string };
  brDarkOrange: { borderRightColor: string };
  blDarkOrange: { borderLeftColor: string };
  btDarkOrange: { borderTopColor: string };
  bbDarkOrange: { borderBottomColor: string };
  normalText: { color: string };
  bgNormalText: { backgroundColor: string };
  borderNormalText: { borderColor: string };
  brNormalText: { borderRightColor: string };
  blNormalText: { borderLeftColor: string };
  btNormalText: { borderTopColor: string };
  bbNormalText: { borderBottomColor: string };
  dimText: { color: string };
  bgDimText: { backgroundColor: string };
  borderDimText: { borderColor: string };
  brDimText: { borderRightColor: string };
  blDimText: { borderLeftColor: string };
  btDimText: { borderTopColor: string };
  bbDimText: { borderBottomColor: string };
  orangeLight: { color: string };
  bgOrangeLight: { backgroundColor: string };
  borderOrangeLight: { borderColor: string };
  brOrangeLight: { borderRightColor: string };
  blOrangeLight: { borderLeftColor: string };
  btOrangeLight: { borderTopColor: string };
  bbOrangeLight: { borderBottomColor: string };
  gradientBrightTop: { color: string };
  bgGradientBrightTop: { backgroundColor: string };
  borderGradientBrightTop: { borderColor: string };
  brGradientBrightTop: { borderRightColor: string };
  blGradientBrightTop: { borderLeftColor: string };
  btGradientBrightTop: { borderTopColor: string };
  bbGradientBrightTop: { borderBottomColor: string };
  red: { color: string };
  bgRed: { backgroundColor: string };
  borderRed: { borderColor: string };
  brRed: { borderRightColor: string };
  blRed: { borderLeftColor: string };
  btRed: { borderTopColor: string };
  bbRed: { borderBottomColor: string };
  notificationRed: { color: string };
  bgNotificationRed: { backgroundColor: string };
  borderNotificationRed: { borderColor: string };
  brNotificationRed: { borderRightColor: string };
  blNotificationRed: { borderLeftColor: string };
  btNotificationRed: { borderTopColor: string };
  bbNotificationRed: { borderBottomColor: string };
  lightRed: { color: string };
  bgLightRed: { backgroundColor: string };
  borderLightRed: { borderColor: string };
  brLightRed: { borderRightColor: string };
  blLightRed: { borderLeftColor: string };
  btLightRed: { borderTopColor: string };
  bbLightRed: { borderBottomColor: string };
  brightRed: { color: string };
  bgBrightRed: { backgroundColor: string };
  borderBrightRed: { borderColor: string };
  brBrightRed: { borderRightColor: string };
  blBrightRed: { borderLeftColor: string };
  btBrightRed: { borderTopColor: string };
  bbBrightRed: { borderBottomColor: string };
  white: { color: string };
  bgWhite: { backgroundColor: string };
  borderWhite: { borderColor: string };
  brWhite: { borderRightColor: string };
  blWhite: { borderLeftColor: string };
  btWhite: { borderTopColor: string };
  bbWhite: { borderBottomColor: string };
  yellow: { color: string };
  bgYellow: { backgroundColor: string };
  borderYellow: { borderColor: string };
  brYellow: { borderRightColor: string };
  blYellow: { borderLeftColor: string };
  btYellow: { borderTopColor: string };
  bbYellow: { borderBottomColor: string };
  notificationYellow: { color: string };
  bgNotificationYellow: { backgroundColor: string };
  borderNotificationYellow: { borderColor: string };
  brNotificationYellow: { borderRightColor: string };
  blNotificationYellow: { borderLeftColor: string };
  btNotificationYellow: { borderTopColor: string };
  bbNotificationYellow: { borderBottomColor: string };
  warningYellow: { color: string };
  bgWarningYellow: { backgroundColor: string };
  borderWarningYellow: { borderColor: string };
  brWarningYellow: { borderRightColor: string };
  blWarningYellow: { borderLeftColor: string };
  btWarningYellow: { borderTopColor: string };
  bbWarningYellow: { borderBottomColor: string };
  green: { color: string };
  bgGreen: { backgroundColor: string };
  borderGreen: { borderColor: string };
  brGreen: { borderRightColor: string };
  blGreen: { borderLeftColor: string };
  btGreen: { borderTopColor: string };
  bbGreen: { borderBottomColor: string };
  notificationGreen: { color: string };
  bgNotificationGreen: { backgroundColor: string };
  borderNotificationGreen: { borderColor: string };
  brNotificationGreen: { borderRightColor: string };
  blNotificationGreen: { borderLeftColor: string };
  btNotificationGreen: { borderTopColor: string };
  bbNotificationGreen: { borderBottomColor: string };
  darkGreen: { color: string };
  bgDarkGreen: { backgroundColor: string };
  borderDarkGreen: { borderColor: string };
  brDarkGreen: { borderRightColor: string };
  blDarkGreen: { borderLeftColor: string };
  btDarkGreen: { borderTopColor: string };
  bbDarkGreen: { borderBottomColor: string };
  black: { color: string };
  bgBlack: { backgroundColor: string };
  borderBlack: { borderColor: string };
  brBlack: { borderRightColor: string };
  blBlack: { borderLeftColor: string };
  btBlack: { borderTopColor: string };
  bbBlack: { borderBottomColor: string };
  deepBlack: { color: string };
  bgDeepBlack: { backgroundColor: string };
  borderDeepBlack: { borderColor: string };
  brDeepBlack: { borderRightColor: string };
  blDeepBlack: { borderLeftColor: string };
  btDeepBlack: { borderTopColor: string };
  bbDeepBlack: { borderBottomColor: string };
  darkGrey: { color: string };
  bgDarkGrey: { backgroundColor: string };
  borderDarkGrey: { borderColor: string };
  brDarkGrey: { borderRightColor: string };
  blDarkGrey: { borderLeftColor: string };
  btDarkGrey: { borderTopColor: string };
  bbDarkGrey: { borderBottomColor: string };
  grey: { color: string };
  bgGrey: { backgroundColor: string };
  borderGrey: { borderColor: string };
  brGrey: { borderRightColor: string };
  blGrey: { borderLeftColor: string };
  btGrey: { borderTopColor: string };
  bbGrey: { borderBottomColor: string };
  grey2: { color: string };
  bgGrey2: { backgroundColor: string };
  borderGrey2: { borderColor: string };
  brGrey2: { borderRightColor: string };
  blGrey2: { borderLeftColor: string };
  btGrey2: { borderTopColor: string };
  bbGrey2: { borderBottomColor: string };
  offWhite: { color: string };
  bgOffWhite: { backgroundColor: string };
  borderOffWhite: { borderColor: string };
  brOffWhite: { borderRightColor: string };
  blOffWhite: { borderLeftColor: string };
  btOffWhite: { borderTopColor: string };
  bbOffWhite: { borderBottomColor: string };
  lightGrey: { color: string };
  bgLightGrey: { backgroundColor: string };
  borderLightGrey: { borderColor: string };
  brLightGrey: { borderRightColor: string };
  blLightGrey: { borderLeftColor: string };
  btLightGrey: { borderTopColor: string };
  bbLightGrey: { borderBottomColor: string };
  lightGrey2: { color: string };
  bgLightGrey2: { backgroundColor: string };
  borderLightGrey2: { borderColor: string };
  brLightGrey2: { borderRightColor: string };
  blLightGrey2: { borderLeftColor: string };
  btLightGrey2: { borderTopColor: string };
  bbLightGrey2: { borderBottomColor: string };
  lightGrey3: { color: string };
  bgLightGrey3: { backgroundColor: string };
  borderLightGrey3: { borderColor: string };
  brLightGrey3: { borderRightColor: string };
  blLightGrey3: { borderLeftColor: string };
  btLightGrey3: { borderTopColor: string };
  bbLightGrey3: { borderBottomColor: string };
  lightGrey4: { color: string };
  bgLightGrey4: { backgroundColor: string };
  borderLightGrey4: { borderColor: string };
  brLightGrey4: { borderRightColor: string };
  blLightGrey4: { borderLeftColor: string };
  btLightGrey4: { borderTopColor: string };
  bbLightGrey4: { borderBottomColor: string };
  background: { color: string };
  bgBackground: { backgroundColor: string };
  borderBackground: { borderColor: string };
  brBackground: { borderRightColor: string };
  blBackground: { borderLeftColor: string };
  btBackground: { borderTopColor: string };
  bbBackground: { borderBottomColor: string };
  // FUNCTIONS
  fs: Function;
  top: Function;
  left: Function;
  right: Function;
  bottom: Function;
  op: Function;
  w: Function;
  minw: Function;
  maxw: Function;
  fw: Function;
  minfw: Function;
  maxfw: Function;
  h: Function;
  minh: Function;
  maxh: Function;
  fh: Function;
  minfh: Function;
  maxfh: Function;
};

const calculatedSt: CalculatedTypes = {
  ...Object.assign(
    generatePercentages('op', 'opacity', (n: number) => n / 100),
    generatePercentages('w', 'width', (n: any) => `${n}%`),
    generatePercentages('minw', 'minWidth', (n: any) => `${n}%`),
    generatePercentages('maxw', 'maxWidth', (n: any) => `${n}%`),
    generatePercentages('fw', 'width', (n: number) => width * (n / 100)),
    generatePercentages('minfw', 'minWidth', (n: number) => width * (n / 100)),
    generatePercentages('maxfw', 'maxWidth', (n: number) => width * (n / 100)),
    generatePercentages('h', 'height', (n: any) => `${n}%`),
    generatePercentages('minh', 'minHeight', (n: any) => `${n}%`),
    generatePercentages('maxh', 'maxHeight', (n: any) => `${n}%`),
    generatePercentages('fh', 'height', (n: number) => height * (n / 100)),
    generatePercentages(
      'minfh',
      'minHeight',
      (n: number) => height * (n / 100),
    ),
    generatePercentages(
      'maxfh',
      'maxHeight',
      (n: number) => height * (n / 100),
    ),

    generateSizes('br', 'borderRadius'),
    generateSizes('brtr', 'borderTopRightRadius'),
    generateSizes('brtl', 'borderTopLeftRadius'),
    generateSizes('brbr', 'borderBottomRightRadius'),
    generateSizes('brbl', 'borderBottomLeftRadius'),

    generateSizes('p', 'padding'),
    generateSizes('pd', 'padding'),
    generateSizes('ph', 'paddingHorizontal'),
    generateSizes('pv', 'paddingVertical'),
    generateSizes('pt', 'paddingTop'),
    generateSizes('pb', 'paddingBottom'),
    generateSizes('pl', 'paddingLeft'),
    generateSizes('pr', 'paddingRight'),

    generateSizes('m', 'margin'),
    generateSizes('mh', 'marginHorizontal'),
    generateSizes('mv', 'marginVertical'),
    generateSizes('mt', 'marginTop'),
    generateSizes('mb', 'marginBottom'),
    generateSizes('ml', 'marginLeft'),
    generateSizes('mr', 'marginRight'),

    generateNums('bw', 'borderWidth'),
    generateNums('btw', 'borderTopWidth'),
    generateNums('bbw', 'borderBottomWidth'),
    generateNums('blw', 'borderLeftWidth'),
    generateNums('brw', 'borderRightWidth'),
    generateNums('zi', 'zIndex'),
    generateNums('ls', 'letterSpacing'),
    generateNums('lh', 'lineHeight'),
    generateNums('f', 'flex'),

    generatedColors,
  ),

  ...Object.assign(
    {},
    generateFn('fs', 'fontSize'),
    generateFn('top', 'top'),
    generateFn('left', 'left'),
    generateFn('right', 'right'),
    generateFn('bottom', 'bottom'),
  ),
};

// Additional styles and function helpers
const st = {
  abs: { position: 'absolute' },
  abst: { position: 'absolute', top: 0 },
  absb: { position: 'absolute', bottom: 0 },
  absl: { position: 'absolute', left: 0 },
  absr: { position: 'absolute', right: 0 },
  abstr: { position: 'absolute', top: 0, right: 0 },
  abstl: { position: 'absolute', top: 0, left: 0 },
  abstrb: { position: 'absolute', top: 0, right: 0, bottom: 0 },
  abstlr: { position: 'absolute', top: 0, left: 0, right: 0 },
  absbr: { position: 'absolute', bottom: 0, right: 0 },
  absbl: { position: 'absolute', bottom: 0, left: 0 },
  absblr: { position: 'absolute', bottom: 0, left: 0 },
  abslr: { position: 'absolute', right: 0, left: 0 },
  absfill: { position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 },

  rel: { position: 'relative' },
  ovh: { overflow: 'hidden' },
  ovv: { overflow: 'visible' },

  bold: { fontWeight: 'bold' },
  semi: { fontWeight: '600' },
  light: { fontWeight: '300' },
  italic: { fontStyle: 'italic' },
  tac: { textAlign: 'center' },
  tal: { textAlign: 'left' },
  tar: { textAlign: 'right' },

  aic: { alignItems: 'center' },
  ais: { alignItems: 'flex-start' },
  aie: { alignItems: 'flex-end' },
  aist: { alignItems: 'stretch' },
  asc: { alignSelf: 'center' },
  ass: { alignSelf: 'flex-start' },
  ase: { alignSelf: 'flex-end' },
  asa: { alignSelf: 'auto' },
  asb: { alignSelf: 'baseline' },
  asst: { alignSelf: 'stretch' },
  jcc: { justifyContent: 'center' },
  jcs: { justifyContent: 'flex-start' },
  jce: { justifyContent: 'flex-end' },
  jcsb: { justifyContent: 'space-between' },
  jcsa: { justifyContent: 'space-around' },
  jcse: { justifyContent: 'space-evenly' },
  jcst: { justifyContent: 'stretch' },
  fdr: { flexDirection: 'row' },
  fdc: { flexDirection: 'column' },

  fs1: { fontSize: 32 },
  fs2: { fontSize: 24 },
  fs3: { fontSize: 18 },
  fs4: { fontSize: 16 },
  fs5: { fontSize: 14 },
  fs6: { fontSize: 12 },
  fs7: { fontSize: 11 },

  fs10: { fontSize: 10 },
  fs12: { fontSize: 12 },
  fs14: { fontSize: 14 },
  fs16: { fontSize: 16 },
  fs18: { fontSize: 18 },
  fs20: { fontSize: 20 },
  fs22: { fontSize: 22 },
  fs24: { fontSize: 24 },

  fontMainSemiBold: { fontFamily: fontFamilyMainSemiBold },
  fontMain: { fontFamily: fontFamilyMain },
  fontMainBold: { fontFamily: fontFamilyMainBold },

  underline: { textDecorationLine: 'underline' },
  circle: (s: number) => ({ width: s, height: s, borderRadius: s / 2 }),
  size: (s: any) => ({ width: s, height: s }),
  rotate: (n: any) => ({ transform: [{ rotate: n }] }),
  hitSlop: (n: any) => ({ top: n, left: n, bottom: n, right: n }),

  colors,
  rgba: hexToRGB,

  shadow: Platform.select({
    ios: {
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 2 },
      shadowColor: colors.black,
      shadowRadius: 1,
    },
    android: {
      elevation: 4,
    },
  }),
  shadow2: Platform.select({
    ios: {
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 2 },
      shadowColor: colors.white,
      shadowRadius: 2,
    },
    android: {
      elevation: 5,
    },
  }),
  shadow3: Platform.select({
    ios: {
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 3 },
      shadowColor: colors.black,
      shadowRadius: 12,
    },
    android: {
      elevation: 15,
    },
  }),

  statusBar: {
    light: {
      animated: true,
      barStyle: 'light-content',
      backgroundColor: colors.black,
    },
    dark: {
      animated: true,
      barStyle: isAndroid ? 'light-content' : 'dark-content',
      backgroundColor: colors.black,
    },
  },
  isAndroid,
  fontFamilyMain,
  fontFamilyMainBold,
  fontFamilyMainSemiBold,
  fullWidth: width,
  fullHeight: height,

  ...calculatedSt,
};

export default st;
