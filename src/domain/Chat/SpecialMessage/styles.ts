import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  mainQuestionCard: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
  },
  mainQuestionContainer: {
    paddingHorizontal: 20,
  },
  mainQuestion: {
    width: '100%',
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: theme.colors.accent,
  },
  questionText: {
    textAlign: 'center',
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l * 1.3,
  },
});

export default styles;
