import { StyleSheet, Platform, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const colors = {
  blue: '#44c8e8',
  darkBlue: '#186078',
  darkerBlue: '#216373',
  offBlue: '#3295ad',
  orange: '#FF9900',
  red: '#ee2f2f',
  pink: '#dc608c',
  green: '#00ff4f',
  yellow: '#fff462',
  olive: '#beb45a',
  black: '#1d1d26',
  deepBlack: '#000000',
  white: '#ffffff',
  offWhite: 'rgba(245,245,245,1)',
  grey: '#98a6b1',
  greyFade: 'rgba(152, 166, 177, 0.25)',
  whiteFade: 'rgba(245, 250, 255, 0.5)',
  blackFade: 'rgba(0, 0, 0, 0.7)',
  darkGrey: '#637076',
  charcoal: '#646464',
  silver: '#dce1e4',
  lightGrey: '#bbbbbb',
  lightestGrey: '#ebebeb',
  transparent: 'transparent',
};

const isAndroid = Platform.OS === 'android';

// Generate { color: ..., bgColor: ...} style object
const generatedColors = Object.keys(colors).reduce((p, key) => {
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

const generateFn = (prefix, value) => ({ [prefix]: n => ({ [value]: n }) });
const generate = (prefix, value, arr, calc) =>
  arr.reduce(
    (p, n, i) => ({
      ...p,
      [`${prefix}${calc ? n : i}`]: { [value]: calc ? calc(n) : n },
    }),
    generateFn(prefix, value),
  );

// pd0, pd1, ..., pd6
const sizes = [0, 50, 30, 25, 15, 10, 5];
const generateSizes = (p, v) => generate(p, v, sizes);

// w0, w10, ..., w100
const percentages = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];
const generatePercentages = (p, v, calc) => generate(p, v, percentages, calc);

// zi0, zi1, ..., zi5
const nums = [0, 1, 2, 3, 4, 5];
const generateNums = (p, v) => generate(p, v, nums);

function hexToRGB(hex, alpha, property) {
  const parse = c => parseInt(c, 16);
  const r = parse(hex.slice(1, 3));
  const g = parse(hex.slice(3, 5));
  const b = parse(hex.slice(5, 7));
  const str = `'rgba(${r},${g},${b},${alpha})'`;
  if (property) {
    return { [property]: str };
  }
  return str;
}

// React Native StyleSheet for optimized styles
const rnStyles = StyleSheet.create({
  abs: { position: 'absolute' },
  abst: { position: 'absolute', top: 0 },
  absb: { position: 'absolute', bottom: 0 },
  absl: { position: 'absolute', left: 0 },
  absr: { position: 'absolute', right: 0 },
  abstr: { position: 'absolute', top: 0, right: 0 },
  abstl: { position: 'absolute', top: 0, left: 0 },
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
  light: { fontWeight: '300' },
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
  fdr: { flexDirection: 'row' },
  fdc: { flexDirection: 'column' },

  fs1: { fontSize: 32 },
  fs2: { fontSize: 24 },
  fs3: { fontSize: 18 },
  fs4: { fontSize: 16 },
  fs5: { fontSize: 14 },
  fs6: { fontSize: 12 },

  ...Object.assign(
    generatePercentages('op', 'opacity', n => n / 100),
    generatePercentages('w', 'width', n => `${n}%`),
    generatePercentages('minw', 'minWidth', n => `${n}%`),
    generatePercentages('maxw', 'maxWidth', n => `${n}%`),
    generatePercentages('fw', 'width', n => width * (n / 100)),
    generatePercentages('minfw', 'minWidth', n => width * (n / 100)),
    generatePercentages('maxfw', 'maxWidth', n => width * (n / 100)),
    generatePercentages('h', 'height', n => `${n}%`),
    generatePercentages('minh', 'minHeight', n => `${n}%`),
    generatePercentages('maxh', 'maxHeight', n => `${n}%`),
    generatePercentages('fh', 'height', n => height * (n / 100)),
    generatePercentages('minfh', 'minHeight', n => height * (n / 100)),
    generatePercentages('maxfh', 'maxHeight', n => height * (n / 100)),

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
    generateNums('zi', 'zIndex'),
    generateNums('ls', 'letterSpacing'),
    generateNums('lh', 'lineHeight'),
    generateNums('f', 'flex'),

    generatedColors,
  ),
});

// Additional styles and function helpers
const extraStyles = {
  ...Object.assign(
    {},
    generateFn('fs', 'fontSize'),
    generateFn('top', 'top'),
    generateFn('left', 'left'),
    generateFn('right', 'right'),
    generateFn('bottom', 'bottom'),
  ),
  circle: s => ({ width: s, height: s, borderRadius: s / 2 }),
  rotate: n => ({ transform: [{ rotate: n }] }),
  hitSlop: n => ({ top: n, left: n, bottom: n, right: n }),

  colors,
  rgba: hexToRGB,
  hasNotch: DeviceInfo.hasNotch(),

  shadow: {
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: colors.black,
    shadowRadius: 1,
    elevation: 4,
  },

  statusBar: {
    light: {
      animated: true,
      barStyle: 'light-content',
    },
    dark: {
      animated: true,
      barStyle: isAndroid ? 'light-content' : 'dark-content',
    },
  },
  isAndroid,
  fullWidth: width,
  fullHeight: height,
};

const st = Object.assign({}, rnStyles, extraStyles);

// Regex Helpers for find
// Find all size/percentage layouts 'st\.[a-z]{0,5}[0-9]{2,3}'
// Find all 1-6 layouts 'st\.[a-z]{0,5}[0-9]{1}'

// const keys = Object.keys(st);
// console.log('keys', keys);

export default st;
