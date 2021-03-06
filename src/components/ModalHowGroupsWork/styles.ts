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
  stepsTitle: {
    fontSize: 24,
    paddingHorizontal: 25,
    paddingVertical: 8,
    color: 'white',
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
    alignSelf: 'center',
  },
  stepImage: {
    // width: '50%',
    // flex: 1,
  },
  stepText: {
    fontSize: theme.fontSizes.l,
    // paddingRight: theme.spacing.xl,
    color: theme.colors.white,
    // width: '50%',
    flex: 1,
    // backgroundColor: theme.colors.red,
  },
  startText: {
    fontSize: 20,
    paddingHorizontal: 25,
    paddingVertical: 25,
    color: 'white',
    textAlign: 'center',
  },
  buttonAction: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    width: 250,
  },
  buttonActionLabel: {
    color: theme.colors.white,
    fontSize: 18,
    textAlign: 'center',
  },
  deviceImage: {
    borderRadius: theme.radius.m,
    borderColor: theme.colors.black,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    elevation: 2,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 5 },
    maxWidth: 130,
    height: 230,
  },
});

export default styles;
