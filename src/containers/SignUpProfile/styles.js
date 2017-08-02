
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
    alignItems: 'center',
    width: DEFAULT.FULL_WIDTH - 110,
  },
});
