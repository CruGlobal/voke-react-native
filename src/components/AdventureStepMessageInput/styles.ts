import { StyleSheet } from 'react-native';

import theme from '../../theme';

const stylesShared = {
  answerText: {
    width: '100%',
    paddingVertical: theme.spacing.m,
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
  }
}

const styles = StyleSheet.create({
  iconSend: {
    color: theme.colors.secondaryAlt,
  },
  mainQuestion: {
    width: '100%',
    paddingBottom: 50,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // backgroundColor: theme.colors.accent,
  },

  answerContainer: {
    backgroundColor: theme.colors.white,
    width: '100%',
    paddingHorizontal: theme.spacing.m,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },

  answerText: {
    ...stylesShared.answerText,
  },
  answerTextLoading: {
    ...stylesShared.answerText,
    opacity: 0,
  }
});

export default styles;
