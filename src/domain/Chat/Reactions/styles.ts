import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  popupWrapper: {
    position: 'absolute',
    width: '100%',
    top: -76,
  },
  popup: {
    backgroundColor: '#fefefe',
    height: 60,
    borderRadius: theme.radius.l,
    paddingHorizontal: theme.spacing.s,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  popupTail: {
    position: 'absolute',
    bottom: -10,
    left: 14,
    zIndex: -1,
  },
  emoji: {
    flex: 1,
    height: 60,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },
  emojiChar: {
    lineHeight: 60,
    fontSize: 38,
    textAlign: 'center',
    color: '#000',
  },
});

export default styles;
