import { StyleSheet, Platform, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const devicesWithNotch = [
  {
    brand: 'Apple',
    model: 'iPhone 11',
  },
  {
    brand: 'Apple',
    model: 'iPhone 11 Pro',
  },
  {
    brand: 'Apple',
    model: 'iPhone 11 Pro Max',
  },
  {
    brand: 'Apple',
    model: 'iPhone X',
  },
  {
    brand: 'Apple',
    model: 'iPhone XS',
  },
  {
    brand: 'Apple',
    model: 'iPhone XS Max',
  },
  {
    brand: 'Apple',
    model: 'iPhone XR',
  },
  {
    brand: 'Asus',
    model: 'ZenFone 5',
  },
  {
    brand: 'Asus',
    model: 'ZenFone 5z',
  },
  {
    brand: 'google',
    model: 'Pixel 3 XL',
  },
  {
    brand: 'Huawei',
    model: 'P20',
  },
  {
    brand: 'Huawei',
    model: 'P20 Plus',
  },
  {
    brand: 'Huawei',
    model: 'P20 Lite',
  },
  {
    brand: 'Huawei',
    model: 'ANE-LX1',
  },
  {
    brand: 'Huawei',
    model: 'INE-LX1',
  },
  {
    brand: 'Huawei',
    model: 'POT-LX1',
  },
  {
    brand: 'Huawei',
    model: 'Honor 10',
  },
  {
    brand: 'Huawei',
    model: 'Mate 20 Lite',
  },
  {
    brand: 'Huawei',
    model: 'Mate 20 Pro',
  },
  {
    brand: 'Huawei',
    model: 'P30 Lite',
  },
  {
    brand: 'Huawei',
    model: 'P30 Pro',
  },
  {
    brand: 'Huawei',
    model: 'Nova 3',
  },
  {
    brand: 'Huawei',
    model: 'Nova 3i',
  },
  {
    brand: 'Leagoo',
    model: 'S9',
  },
  {
    brand: 'LG',
    model: 'G7',
  },
  {
    brand: 'LG',
    model: 'G7 ThinQ',
  },
  {
    brand: 'LG',
    model: 'G7+ ThinQ',
  },
  {
    brand: 'LG',
    model: 'LM-Q910', //G7 One
  },
  {
    brand: 'LG',
    model: 'LM-G710', //G7 ThinQ
  },
  {
    brand: 'LG',
    model: 'LM-V405', //V40 ThinQ
  },
  {
    brand: 'Motorola',
    model: 'Moto g7 Play',
  },
  {
    brand: 'Motorola',
    model: 'Moto g7 Power',
  },
  {
    brand: 'Motorola',
    model: 'One',
  },
  {
    brand: 'Motorola',
    model: 'Motorola One Vision',
  },
  {
    brand: 'Nokia',
    model: '5.1 Plus',
  },
  {
    brand: 'Nokia',
    model: 'Nokia 6.1 Plus',
  },
  {
    brand: 'Nokia',
    model: '7.1',
  },
  {
    brand: 'Nokia',
    model: '8.1',
  },
  {
    brand: 'OnePlus',
    model: '6',
  },
  {
    brand: 'OnePlus',
    model: 'A6003',
  },
  {
    brand: 'ONEPLUS',
    model: 'A6000',
  },
  {
    brand: 'OnePlus',
    model: 'OnePlus A6003',
  },
  {
    brand: 'OnePlus',
    model: 'ONEPLUS A6010',
  },
  {
    brand: 'OnePlus',
    model: 'ONEPLUS A6013',
  },
  {
    brand: 'OnePlus',
    model: 'ONEPLUS A6000',
  },
  {
    brand: 'Oppo',
    model: 'R15',
  },
  {
    brand: 'Oppo',
    model: 'R15 Pro',
  },
  {
    brand: 'Oppo',
    model: 'F7',
  },
  {
    brand: 'Oukitel',
    model: 'U18',
  },
  {
    brand: 'Sharp',
    model: 'Aquos S3',
  },
  {
    brand: 'Vivo',
    model: 'V9',
  },
  {
    brand: 'Vivo',
    model: 'X21',
  },
  {
    brand: 'Vivo',
    model: 'X21 UD',
  },
  {
    brand: 'xiaomi',
    model: 'MI 8',
  },
  {
    brand: 'xiaomi',
    model: 'MI 8 Explorer Edition',
  },
  {
    brand: 'xiaomi',
    model: 'MI 8 SE',
  },
  {
    brand: 'xiaomi',
    model: 'MI 8 UD',
  },
  {
    brand: 'xiaomi',
    model: 'MI 8 Lite',
  },
  {
    brand: 'xiaomi',
    model: 'Mi 9',
  },
  {
    brand: 'xiaomi',
    model: 'POCO F1',
  },
  {
    brand: 'xiaomi',
    model: 'POCOPHONE F1',
  },
  {
    brand: 'xiaomi',
    model: 'Redmi 6 Pro',
  },
  {
    brand: 'xiaomi',
    model: 'Redmi Note 7',
  },
  {
    brand: 'xiaomi',
    model: 'Mi A2 Lite',
  },
];

const colors = {
  blue: '#44c8e8',
  darkBlue: '#186078',
  darkerBlue: '#216373',
  offBlue: '#3295ad',
  orange: '#FF9900',
  lightOrange: 'rgba(255,153,0, 0.7)',
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
let notch = false;
export function hasNotch() {
  if (!notch) {
    let _brand = DeviceInfo.getBrand();
    let _model = DeviceInfo.getModel();
    console.log(notch, _brand, _model);
    notch =
      devicesWithNotch.findIndex(
        item =>
          item.brand.toLowerCase() === _brand.toLowerCase() &&
          item.model.toLowerCase() === _model.toLowerCase(),
      ) !== -1;
    console.log('new notch', notch);
  }
  return notch;
}

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

let { width, height } = Dimensions.get('window');

if (width > height) {
  width = Dimensions.get('window').height;
  height = Dimensions.get('window').width;
}

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

const st = {
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
  normal: { fontWeight: 'normal' },
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
  fdcr: { flexDirection: 'column-reverse' },
  fdrr: { flexDirection: 'row-reverse' },

  fs1: { fontSize: 32 },
  fs2: { fontSize: 24 },
  fs3: { fontSize: 18 },
  fs4: { fontSize: 16 },
  fs5: { fontSize: 14 },
  fs6: { fontSize: 12 },

  ...Object.assign(
    {},
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

// const st = { ...rnStyles, ...extraStyles };

// Regex Helpers for find
// Find all size/percentage layouts 'st\.[a-z]{0,5}[0-9]{2,3}'
// Find all 1-6 layouts 'st\.[a-z]{0,5}[0-9]{1}'

// const keys = Object.keys(st);
// console.log('keys', keys);

export default st;
