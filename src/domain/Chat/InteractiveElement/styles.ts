import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const stylesShared = StyleSheet.create({
  answerText: {
    width: '100%',
    paddingVertical: theme.spacing.m,
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
  },
  messageBubble: {
    borderRadius: theme.radius.m,
    overflow: 'hidden',
    alignItems: 'center',
  },
  question: {
    flex: 1,
    color: theme.colors.white,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  buttonSend: {
    right: -15,
    alignSelf: 'flex-end',
  },
  iconSend: {
    color: theme.colors.secondaryAlt,
  },

  answerContainer: {
    backgroundColor: theme.colors.white,
    width: '100%',
    paddingHorizontal: theme.spacing.m,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  answerText: {
    ...stylesShared.answerText,
  },
  answerTextLoading: {
    ...stylesShared.answerText,
    opacity: 0,
  },

  answerSkipped: {
    ...stylesShared.answerText,
    color: theme.colors.gray,
    opacity: 0.4,
  },

  answerTextInput: {
    flex: 1,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
    marginRight: 6,
    fontFamily: theme.fonts.regular,
  },

  binaryBubble: {
    ...stylesShared.messageBubble,
    backgroundColor: theme.colors.black,
  },
  shareQBubble: {
    ...stylesShared.messageBubble,
    backgroundColor: theme.colors.secondary,
  },

  binaryName: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  shareQName: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    paddingTop: theme.spacing.l,
    marginBottom: -theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
    opacity: 0.75,
  },
  binaryComment: {
    paddingHorizontal: theme.spacing.l,
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  mainQuestion: {
    width: '100%',
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.l * 1.4,
    paddingHorizontal: theme.spacing.m,
  },
  binaryQuestion: {
    ...stylesShared.question,
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.3,
  },
  shareQuestion: {
    ...stylesShared.question,
    fontSize: theme.fontSizes.l,
  },
  binaryOptionsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
  },
});

export default styles;
