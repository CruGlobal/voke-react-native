
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  headerWrap: {
    marginTop: 30,
    marginBottom: 40,
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
  signInButton: {
    fontSize: 16,
  },
  actionButton: {
    marginTop: 15,
    alignItems: 'center',
    width: DEFAULT.FULL_WIDTH - 110,
  },
});
