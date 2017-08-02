
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
  photoText: {
    color: theme.secondaryColor,
  },
  imageSelect: {
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 40,
    width: 75,
    height: 75,
    marginBottom: 20,
  },
  headerText: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 15,
  },
  inputs: {
    paddingBottom: 50,
  },
  inputBox: {
    marginTop: 10,
    padding: 10,
    width: DEFAULT.FULL_WIDTH - 110,
    borderWidth: 1,
    borderColor: theme.textColor,
    borderRadius: 5,
    fontSize: 15,
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
