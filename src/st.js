import { Platform, Dimensions } from 'react-native';

const isAndroid = Platform.OS === 'android';

const colors = {
  blue: '#44c8e8',
  darkBlue: '#186078',
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
  return {
    ...p,
    [`bg${key.charAt(0).toUpperCase() + key.slice(1)}`]: {
      backgroundColor: value,
    },
    [`border${key.charAt(0).toUpperCase() + key.slice(1)}`]: {
      borderColor: value,
    },
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

const st = {
  abs: { position: 'absolute' },
  absT: { position: 'absolute', top: 0 },
  absTR: { position: 'absolute', top: 0, right: 0 },
  absTL: { position: 'absolute', top: 0, left: 0 },
  absB: { position: 'absolute', bottom: 0 },
  absBR: { position: 'absolute', bottom: 0, right: 0 },
  absBL: { position: 'absolute', bottom: 0, left: 0 },
  absFill: { position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 },

  rel: { position: 'relative' },
  ovh: { overflow: 'hidden' },

  bw0: { borderWidth: 0 },
  bw1: { borderWidth: 1 },
  bw2: { borderWidth: 2 },
  bw3: { borderWidth: 3 },

  bold: { fontWeight: 'bold' },
  tac: { textAlign: 'center' },
  tal: { textAlign: 'left' },
  tar: { textAlign: 'right' },

  circle: s => ({ width: s, height: s, borderRadius: s / 2 }),

  f1: { flex: 1 },
  aic: { alignItems: 'center' },
  ais: { alignItems: 'flex-start' },
  aie: { alignItems: 'flex-end' },
  jcc: { justifyContent: 'center' },
  jcs: { justifyContent: 'flex-start' },
  jce: { justifyContent: 'flex-end' },

  fs1: { fontSize: 32 },
  fs2: { fontSize: 22 },
  fs3: { fontSize: 18 },
  fs4: { fontSize: 16 },
  fs5: { fontSize: 14 },
  fs6: { fontSize: 12 },

  ...generatePercentages('op', 'opacity', n => n / 100),
  ...generatePercentages('w', 'width', n => `${n}%`),
  ...generatePercentages('fw', 'width', n => DEVICE_WIDTH * (n / 100)),
  ...generatePercentages('h', 'height', n => `${n}%`),
  ...generatePercentages('fh', 'height', n => DEVICE_HEIGHT * (n / 100)),

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

  colors,
  ...generatedColors,

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
};

export default st;
