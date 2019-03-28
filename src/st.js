import { Platform, Dimensions } from 'react-native';

const isAndroid = Platform.OS === 'android';

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

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

// Default styles

// pd0, pd1, ..., pd6
const sizes = [0, 50, 30, 25, 15, 10, 5];
const generateSizes = (prefix, value) =>
  sizes.reduce((p, n, i) => ({ ...p, [`${prefix}${i}`]: { [value]: n } }), {});

// w0, w10, ..., w100
const percentages = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];
const generatePercentages = (prefix, value, calc) =>
  percentages.reduce(
    (p, n) => ({ ...p, [`${prefix}${n}`]: { [value]: calc(n) } }),
    {},
  );
// zi0, zi1, ..., zi5
const nums = [0, 1, 2, 3, 4, 5];
const generateNums = (prefix, value) =>
  nums.reduce((p, n, i) => ({ ...p, [`${prefix}${i}`]: { [value]: n } }), {});

const generateFn = (prefix, value) => ({ [prefix]: n => ({ [value]: n }) });

function hexToRGB(hex, alpha) {
  const parse = c => parseInt(c, 16);
  const r = parse(hex.slice(1, 3));
  const g = parse(hex.slice(3, 5));
  const b = parse(hex.slice(5, 7));
  return `'rgba(${r},${g},${b},${alpha})'`;
}
const st = {
  abs: { position: 'absolute' },
  abst: { position: 'absolute', top: 0 },
  abstr: { position: 'absolute', top: 0, right: 0 },
  abstl: { position: 'absolute', top: 0, left: 0 },
  absb: { position: 'absolute', bottom: 0 },
  absbr: { position: 'absolute', bottom: 0, right: 0 },
  absbl: { position: 'absolute', bottom: 0, left: 0 },
  absfill: { position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 },

  rel: { position: 'relative' },
  ovh: { overflow: 'hidden' },

  bold: { fontWeight: 'bold' },
  tac: { textAlign: 'center' },
  tal: { textAlign: 'left' },
  tar: { textAlign: 'right' },

  f1: { flex: 1 },
  aic: { alignItems: 'center' },
  ais: { alignItems: 'flex-start' },
  aie: { alignItems: 'flex-end' },
  asc: { alignSelf: 'center' },
  ass: { alignSelf: 'flex-start' },
  ase: { alignSelf: 'flex-end' },
  jcc: { justifyContent: 'center' },
  jcs: { justifyContent: 'flex-start' },
  jce: { justifyContent: 'flex-end' },

  fs1: { fontSize: 32 },
  fs2: { fontSize: 24 },
  fs3: { fontSize: 18 },
  fs4: { fontSize: 16 },
  fs5: { fontSize: 14 },
  fs6: { fontSize: 12 },

  ...generatePercentages('op', 'opacity', n => n / 100),
  ...generatePercentages('w', 'width', n => `${n}%`),
  ...generatePercentages('minw', 'minWidth', n => `${n}%`),
  ...generatePercentages('maxw', 'maxWidth', n => `${n}%`),
  ...generatePercentages('fw', 'width', n => DEVICE_WIDTH * (n / 100)),
  ...generatePercentages('minfw', 'minWidth', n => DEVICE_WIDTH * (n / 100)),
  ...generatePercentages('maxfw', 'maxWidth', n => DEVICE_WIDTH * (n / 100)),
  ...generatePercentages('h', 'height', n => `${n}%`),
  ...generatePercentages('minh', 'minHeight', n => `${n}%`),
  ...generatePercentages('maxh', 'maxHeight', n => `${n}%`),
  ...generatePercentages('fh', 'height', n => DEVICE_HEIGHT * (n / 100)),
  ...generatePercentages('minfh', 'minHeight', n => DEVICE_HEIGHT * (n / 100)),
  ...generatePercentages('maxfh', 'maxHeight', n => DEVICE_HEIGHT * (n / 100)),

  ...generateSizes('br', 'borderRadius'),
  ...generateSizes('brtr', 'borderTopRightRadius'),
  ...generateSizes('brtl', 'borderTopLeftRadius'),
  ...generateSizes('brbr', 'borderBottomRightRadius'),
  ...generateSizes('brbl', 'borderBottomLeftRadius'),

  ...generateSizes('pd', 'padding'),
  ...generateSizes('ph', 'paddingHorizontal'),
  ...generateSizes('pv', 'paddingVertical'),
  ...generateSizes('pt', 'paddingTop'),
  ...generateSizes('pb', 'paddingBottom'),
  ...generateSizes('pl', 'paddingLeft'),
  ...generateSizes('pr', 'paddingRight'),

  ...generateSizes('m', 'margin'),
  ...generateSizes('mh', 'marginHorizontal'),
  ...generateSizes('mv', 'marginVertical'),
  ...generateSizes('mt', 'marginTop'),
  ...generateSizes('mb', 'marginBottom'),
  ...generateSizes('ml', 'marginLeft'),
  ...generateSizes('mr', 'marginRight'),

  ...generateNums('bw', 'borderWidth'),
  ...generateNums('zi', 'zIndex'),
  ...generateNums('ls', 'letterSpacing'),
  ...generateNums('lh', 'lineHeight'),

  ...generateFn('br', 'borderRadius'),
  ...generateFn('brtr', 'borderTopRightRadius'),
  ...generateFn('brtl', 'borderTopLeftRadius'),
  ...generateFn('brbr', 'borderBottomRightRadius'),
  ...generateFn('brbl', 'borderBottomLeftRadius'),
  ...generateFn('pd', 'padding'),
  ...generateFn('ph', 'paddingHorizontal'),
  ...generateFn('pv', 'paddingVertical'),
  ...generateFn('pt', 'paddingTop'),
  ...generateFn('pb', 'paddingBottom'),
  ...generateFn('pl', 'paddingLeft'),
  ...generateFn('pr', 'paddingRight'),
  ...generateFn('m', 'margin'),
  ...generateFn('mh', 'marginHorizontal'),
  ...generateFn('mv', 'marginVertical'),
  ...generateFn('mt', 'marginTop'),
  ...generateFn('mb', 'marginBottom'),
  ...generateFn('ml', 'marginLeft'),
  ...generateFn('mr', 'marginRight'),
  ...generateFn('fs', 'fontSize'),
  ...generateFn('w', 'width'),
  ...generateFn('minw', 'minWidth'),
  ...generateFn('maxw', 'maxWidth'),
  ...generateFn('h', 'height'),
  ...generateFn('minh', 'minHeight'),
  ...generateFn('maxh', 'maxHeight'),
  ...generateFn('bw', 'borderWidth'),
  ...generateFn('zi', 'zIndex'),
  ...generateFn('ls', 'letterSpacing'),
  ...generateFn('lh', 'lineHeight'),
  ...generateFn('top', 'top'),
  ...generateFn('left', 'left'),
  ...generateFn('right', 'right'),
  ...generateFn('bottom', 'bottom'),

  circle: s => ({ width: s, height: s, borderRadius: s / 2 }),
  rotate: n => ({ transform: [{ rotate: n }] }),

  colors,
  ...generatedColors,
  rgba: hexToRGB,

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
  fullWidth: DEVICE_WIDTH,
  fullHeight: DEVICE_HEIGHT,
};

export default st;
