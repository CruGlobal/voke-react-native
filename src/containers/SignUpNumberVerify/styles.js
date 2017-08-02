
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  headerWrap: {
    paddingVertical: 30,
  },
  headerTitle: {
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 22,
    color: theme.secondaryColor,
  },
  headerText: {
    paddingHorizontal: 70,
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 15,
  },
  inputs: {
    paddingBottom: 50,
  },
  inputBox: {
    padding: 10,
    marginLeft: 10,
    width: 200,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
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
    width: 125,
    marginBottom: 30,
  },
});
