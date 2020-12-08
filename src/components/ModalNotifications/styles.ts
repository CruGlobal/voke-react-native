import { StyleSheet } from 'react-native';

import theme from 'utils/theme';

const sharedStyles = {
  title: {
    // fontSize: theme.fontSizes.l,
  },
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonAccept: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    width: 250,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonAcceptLabel: {
    color: theme.colors.white,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonCancel: {
    alignSelf: 'flex-end',
    alignContent: 'center',
    borderColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    width: 250,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonCancelLabel: {
    color: theme.colors.white,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;
