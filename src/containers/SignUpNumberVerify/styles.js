import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  inputs: {
    paddingBottom: 50,
  },
  inputBox: {
    padding: 10,
    marginLeft: 10,
    width: 200,
    fontSize: 15,
  },
  resendCode: {
    fontSize: 14,
    paddingTop: 10,
  },
  signInButton: {
    fontSize: 16,
  },
  actionButton: {
    alignItems: 'center',
    width: theme.fullWidth - 110,
    marginBottom: 30,
  },
  actionButtonSkip: {
    alignItems: 'center',
    marginBottom: 30,
    width: 60,
  },
});
