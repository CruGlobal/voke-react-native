import { matches } from 'lodash';
import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const stylesShared = {
  answerText: {
    width: '100%',
    paddingVertical: theme.spacing.m,
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
  },
};

const styles = StyleSheet.create({
  buttonSend: {
    padding: 20,
    right: -15,
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
  },

  answerText: {
    ...stylesShared.answerText,
  },
  answerTextLoading: {
    ...stylesShared.answerText,
    opacity: 0,
  },

  binaryBubble: {
    borderRadius: theme.radius.m,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: theme.colors.black,
  },

  binaryName: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  binaryComment: {
    paddingHorizontal: theme.spacing.l,
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  mainQuestion: {
    width: '100%',
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.m,
  },
  binaryQuestion: {
    flex: 1,
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.3,
    textAlign: 'center',
  },
  binaryOptionsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },
});

export default styles;
