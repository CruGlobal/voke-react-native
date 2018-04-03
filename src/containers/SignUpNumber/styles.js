
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  inputs: {
    paddingTop: 20,
    paddingBottom: 50,
  },
  inputBox: {
    marginTop: 10,
    padding: 10,
    width: theme.fullWidth - 110,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 15,
    color: theme.textColor,
  },
  signInButton: {
    fontSize: 16,
  },
  dropDown: {
    width: theme.fullWidth - 110,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  countrySelect: {
    color: theme.textColor,
    flex: 1,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 30,
    width: 125,
  },
  sharingText: {
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 40,
    textAlign: 'center',
  },
});
