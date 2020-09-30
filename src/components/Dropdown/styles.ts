import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
    minHeight: 26,
  },
  dropDownIcon: { color: theme.colors.white },
  inputIOS: {
    textAlign: 'center',
    paddingLeft: 25,
    paddingVertical: 10,
    height: 50,
    color: 'white',
    fontSize: 24,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondaryAlt,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: '40%',
    right: 10,
  },
  descriptionContainer: {
    width: '100%',
    minHeight: theme.spacing.xl,
  },
  descriptionText: {
    color: theme.colors.secondary,
    paddingTop: 10,
    fontSize: theme.fontSizes.s,
    alignSelf: 'center',
  },
});

export default styles;
