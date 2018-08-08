import { StyleSheet } from 'react-native';
import theme from '../../theme';
const IMAGE_SIZE = 100;

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
    fontSize: 22,
    color: theme.secondaryColor,
  },
  inputs: {
    paddingBottom: 50,
    paddingTop: 25,
  },
  signInButton: {
    fontSize: 16,
  },
  legalText: {
    color: theme.accentColor,
    marginHorizontal: 25,
  },
  actionButton: {
    marginTop: 8,
    alignItems: 'center',
    width: theme.fullWidth - 110,
  },
  haveAccountText: {
    textAlign: 'center',
    color: theme.accentColor,
  },
  haveAccount: {
    paddingLeft: 10,
  },
  legalLinkText: {
    fontSize: 12,
    color: theme.textColor,
  },
  legalLink: {
    padding: 0,
    margin: 0,
  },
  haveAccountButton: {
    fontSize: 14,
  },
  accountWrap: {
    position: 'absolute',
    bottom: 0,
  },
  imageSelect: {
    borderWidth: 1,
    borderColor: theme.lightBackgroundColor,
    borderRadius: IMAGE_SIZE / 2,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginBottom: 10,
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    borderWidth: 1,
    borderColor: theme.lightBackgroundColor,
  },
});
