
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  modal: {
    width: theme.fullWidth - 70,
    backgroundColor: COLORS.WHITE,
    // height: 250,
    padding: 10,
    borderRadius: 0,
    overflow: 'hidden',
  },
  title: {
    color: theme.darkText,
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
  },
  buttonText: {
    color: theme.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    padding: 5,
  },
  inputBox: {
    marginTop: 8,
    padding: 10,
    width: theme.fullWidth - 110,
    fontSize: 16,
    color: theme.darkText,
  },
});
