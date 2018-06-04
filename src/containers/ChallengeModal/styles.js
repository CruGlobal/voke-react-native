
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modal: {
    padding: 50,
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 28,
    marginVertical: 20,
  },
  icon: {
    marginTop: 20,
  },
  buttonText: {
    color: theme.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    borderColor: theme.primaryColor,
    minWidth: 200,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonWrapper: {
    padding: 5,
  },
  description: {
    fontSize: 16,
    color: theme.white,
  },
});
