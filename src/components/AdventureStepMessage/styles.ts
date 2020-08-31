import { StyleSheet } from 'react-native';

import theme from '../../theme';

const sharedStyles = {
  avatar: {
    position: 'absolute',
    bottom: 0,
    height: 25,
    width: 25,
    borderRadius: 50,
  }
}

const styles = StyleSheet.create({
  listLoading: {
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
  cardLoading: {
    backgroundColor: theme.colors.secondaryAlt,
    opacity: 0.5,
    width: '100%',
    height: 110,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
  },
  listOfSteps: {
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.m,
  },
  userAvatar: {
    ...sharedStyles.avatar,

    left:-30,
  },
  myAvatar: {
    ...sharedStyles.avatar,

    right:-30,
  }
});

export default styles;
