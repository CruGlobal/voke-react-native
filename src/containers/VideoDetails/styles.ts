import { StyleSheet } from 'react-native';

import theme from '../../theme';

const sharedStyles = {
  buttonLike: {
    width: 50,
    height: 50,
    borderRadius: 50,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const styles = StyleSheet.create({
  buttonLikeActive: {
    ...sharedStyles.buttonLike,
    backgroundColor: theme.colors.primary,
  },
  buttonLikeInactive: {
    ...sharedStyles.buttonLike,
    backgroundColor: theme.colors.grey,
  },
});

export default styles;
