import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: -1000,
    bottom: -1000,
    left: -1000,
    right: -1000,
    backgroundColor: 'rgba(0,0,0,.7)',
    zIndex: 1,
  },
  animatedBubble: {
    zIndex: 2,
    width: '100%',
  },
});

export default styles;
