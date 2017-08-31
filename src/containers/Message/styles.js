
import { StyleSheet } from 'react-native';
import theme, { COLORS, DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  inputWrap: {
    backgroundColor: theme.secondaryColor,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  chatBox: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: theme.accentColor,
    borderRadius: 3,
  },
  chatInput: {
    textAlignVertical: 'center',
    color: theme.textColor,
    paddingVertical: 5,
    marginVertical: 5,
    fontSize: 16,
    flex: 15,
  },
  sendIcon: {
    color: theme.textColor,
    fontSize: 30,
  },
  sendButton: {
    width: 55,
    alignItems: 'flex-end',
    paddingVertical: 5,
    flex: 1,
  },
  transparentOverlay: {
    backgroundColor: COLORS.TRANSPARENT,
    width: DEFAULT.FULL_WIDTH,
    position: 'absolute',
  },
});
