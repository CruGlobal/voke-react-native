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
  messageContainer: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  messageContent: {
    paddingHorizontal: 20,
  },
  messageSharedContent: {
    padding: theme.spacing.m,
    backgroundColor: 'rgba(0,0,0,.2)',
  },
  userAvatar: {
    ...sharedStyles.avatar,
    left: -30,
  },
  myAvatar: {
    ...sharedStyles.avatar,
    right: -30,
  },
  icon: {
    color: theme.colors.white,
  },
  mainQuestionCard: {
    // paddingTop: theme.spacing.l,
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
  messageMeta: {

  }
});

export default styles;