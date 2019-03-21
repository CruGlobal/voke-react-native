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

const size = { 1: 50, 2: 30, 3: 25, 4: 15, 5: 10, 6: 5 };
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
// Default styles
const st = {
  abs: { position: 'absolute' },
  absT: { position: 'absolute', top: 0 },
  absTR: { position: 'absolute', top: 0, right: 0 },
  absTL: { position: 'absolute', top: 0, left: 0 },
  absB: { position: 'absolute', bottom: 0 },
  absBR: { position: 'absolute', bottom: 0, right: 0 },
  absBL: { position: 'absolute', bottom: 0, left: 0 },
  absFill: { position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 },

  bw1: { borderWidth: 1 },
  bw2: { borderWidth: 2 },
  bw3: { borderWidth: 3 },

  bold: { fontWeight: 'bold' },
  tac: { textAlign: 'center' },
  tal: { textAlign: 'left' },
  tar: { textAlign: 'right' },

  circle: s => ({ width: s, height: s, borderRadius: s / 2 }),

  op100: { opacity: 1 },
  op75: { opacity: 0.75 },
  op60: { opacity: 0.6 },
  op50: { opacity: 0.5 },
  op25: { opacity: 0.25 },

  w100: { width: '100%' },
  w90: { width: '90%' },
  w75: { width: '75%' },
  w50: { width: '50%' },
  w25: { width: '25%' },
  fw: { width: DEVICE_WIDTH },
  fw90: { width: DEVICE_WIDTH * 0.9 },
  fw75: { width: DEVICE_WIDTH * 0.75 },
  fw50: { width: DEVICE_WIDTH * 0.5 },
  fw25: { width: DEVICE_WIDTH * 0.25 },
  fw10: { width: DEVICE_WIDTH * 0.1 },

  fh: { height: DEVICE_HEIGHT },
  fh90: { width: DEVICE_HEIGHT * 0.9 },
  fh75: { width: DEVICE_HEIGHT * 0.75 },
  fh50: { width: DEVICE_HEIGHT * 0.5 },
  fh25: { width: DEVICE_HEIGHT * 0.25 },
  fh10: { width: DEVICE_HEIGHT * 0.1 },

  h100: { height: '100%' },
  h75: { height: '75%' },
  h50: { height: '50%' },
  h25: { height: '25%' },

  f1: { flex: 1 },
  aic: { alignItems: 'center' },
  ais: { alignItems: 'flex-start' },
  aie: { alignItems: 'flex-end' },
  jcc: { justifyContent: 'center' },
  jcs: { justifyContent: 'flex-start' },
  jce: { justifyContent: 'flex-end' },

  br1: { borderRadius: size[1] },
  br2: { borderRadius: size[2] },
  br3: { borderRadius: size[3] },
  br4: { borderRadius: size[4] },
  br5: { borderRadius: size[5] },
  br6: { borderRadius: size[6] },

  brtr1: { borderTopRightRadius: size[1] },
  brtr2: { borderTopRightRadius: size[2] },
  brtr3: { borderTopRightRadius: size[3] },
  brtr4: { borderTopRightRadius: size[4] },
  brtr5: { borderTopRightRadius: size[5] },
  brtr6: { borderTopRightRadius: size[6] },

  brtl1: { borderTopLeftRadius: size[1] },
  brtl2: { borderTopLeftRadius: size[2] },
  brtl3: { borderTopLeftRadius: size[3] },
  brtl4: { borderTopLeftRadius: size[4] },
  brtl5: { borderTopLeftRadius: size[5] },
  brtl6: { borderTopLeftRadius: size[6] },

  brbr1: { borderBottomRightRadius: size[1] },
  brbr2: { borderBottomRightRadius: size[2] },
  brbr3: { borderBottomRightRadius: size[3] },
  brbr4: { borderBottomRightRadius: size[4] },
  brbr5: { borderBottomRightRadius: size[5] },
  brbr6: { borderBottomRightRadius: size[6] },

  brbl1: { borderBottomLeftRadius: size[1] },
  brbl2: { borderBottomLeftRadius: size[2] },
  brbl3: { borderBottomLeftRadius: size[3] },
  brbl4: { borderBottomLeftRadius: size[4] },
  brbl5: { borderBottomLeftRadius: size[5] },
  brbl6: { borderBottomLeftRadius: size[6] },

  fs1: { fontSize: 32 },
  fs2: { fontSize: 22 },
  fs3: { fontSize: 18 },
  fs4: { fontSize: 16 },
  fs5: { fontSize: 14 },
  fs6: { fontSize: 12 },

  pd1: { padding: size[1] },
  pd2: { padding: size[2] },
  pd3: { padding: size[3] },
  pd4: { padding: size[4] },
  pd5: { padding: size[5] },
  pd6: { padding: size[6] },

  ph1: { paddingHorizontal: size[1] },
  ph2: { paddingHorizontal: size[2] },
  ph3: { paddingHorizontal: size[3] },
  ph4: { paddingHorizontal: size[4] },
  ph5: { paddingHorizontal: size[5] },
  ph6: { paddingHorizontal: size[6] },

  pv1: { paddingVertical: size[1] },
  pv2: { paddingVertical: size[2] },
  pv3: { paddingVertical: size[3] },
  pv4: { paddingVertical: size[4] },
  pv5: { paddingVertical: size[5] },
  pv6: { paddingVertical: size[6] },

  pt1: { paddingTop: size[1] },
  pt2: { paddingTop: size[2] },
  pt3: { paddingTop: size[3] },
  pt4: { paddingTop: size[4] },
  pt5: { paddingTop: size[5] },
  pt6: { paddingTop: size[6] },

  pb1: { paddingBottom: size[1] },
  pb2: { paddingBottom: size[2] },
  pb3: { paddingBottom: size[3] },
  pb4: { paddingBottom: size[4] },
  pb5: { paddingBottom: size[5] },
  pb6: { paddingBottom: size[6] },

  pl1: { paddingLeft: size[1] },
  pl2: { paddingLeft: size[2] },
  pl3: { paddingLeft: size[3] },
  pl4: { paddingLeft: size[4] },
  pl5: { paddingLeft: size[5] },
  pl6: { paddingLeft: size[6] },

  pr1: { paddingRight: size[1] },
  pr2: { paddingRight: size[2] },
  pr3: { paddingRight: size[3] },
  pr4: { paddingRight: size[4] },
  pr5: { paddingRight: size[5] },
  pr6: { paddingRight: size[6] },

  m1: { margin: size[1] },
  m2: { margin: size[2] },
  m3: { margin: size[3] },
  m4: { margin: size[4] },
  m5: { margin: size[5] },
  m6: { margin: size[6] },

  mh1: { marginHorizontal: size[1] },
  mh2: { marginHorizontal: size[2] },
  mh3: { marginHorizontal: size[3] },
  mh4: { marginHorizontal: size[4] },
  mh5: { marginHorizontal: size[5] },
  mh6: { marginHorizontal: size[6] },

  mv1: { marginVertical: size[1] },
  mv2: { marginVertical: size[2] },
  mv3: { marginVertical: size[3] },
  mv4: { marginVertical: size[4] },
  mv5: { marginVertical: size[5] },
  mv6: { marginVertical: size[6] },

  mt1: { marginTop: size[1] },
  mt2: { marginTop: size[2] },
  mt3: { marginTop: size[3] },
  mt4: { marginTop: size[4] },
  mt5: { marginTop: size[5] },
  mt6: { marginTop: size[6] },

  mb1: { marginBottom: size[1] },
  mb2: { marginBottom: size[2] },
  mb3: { marginBottom: size[3] },
  mb4: { marginBottom: size[4] },
  mb5: { marginBottom: size[5] },
  mb6: { marginBottom: size[6] },

  ml1: { marginLeft: size[1] },
  ml2: { marginLeft: size[2] },
  ml3: { marginLeft: size[3] },
  ml4: { marginLeft: size[4] },
  ml5: { marginLeft: size[5] },
  ml6: { marginLeft: size[6] },

  mr1: { marginRight: size[1] },
  mr2: { marginRight: size[2] },
  mr3: { marginRight: size[3] },
  mr4: { marginRight: size[4] },
  mr5: { marginRight: size[5] },
  mr6: { marginRight: size[6] },

  ovh: { overflow: 'hidden' },

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

st.header = {
  dark: {
    headerStyle: st.bgBlack,
    headerTitleStyle: [st.bold, st.white],
    headerTintColor: st.colors.white,
  },
};

export default st;
