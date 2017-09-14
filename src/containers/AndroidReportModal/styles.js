
import { StyleSheet } from 'react-native';
import theme, { DEFAULT, COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  modal: {
    width: DEFAULT.FULL_WIDTH - 70,
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
    width: DEFAULT.FULL_WIDTH - 110,
    fontSize: 16,
    color: theme.darkText,
  },
});
