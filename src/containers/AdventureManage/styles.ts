import { StyleSheet } from 'react-native';

import theme from '../../theme';

const sharredStyles = {
  avatarCommon: {
    width: 42,
    height: 42,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#fff',
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.l,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xxl,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    elevation: 4,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 8 },
    // width: '60%',
  },
  smallButtonLabel: {
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l * 1.5,
    textAlign: 'center',
    color: theme.colors.secondary,
  }
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.primary,
  },
  header: {
    paddingTop: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
  },
  invite: {
    paddingTop: theme.spacing.s,
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  inviteCode: {
    color: theme.colors.white,
    fontFamily: theme.fonts.semiBold,
  },
  releaseSchedule: {
    paddingTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
    // textAlign: 'center',
  },
  releaseScheduleText: {
    color: theme.colors.white,
    // textAlign: 'center',
  },
  members: {
    paddingTop: theme.spacing.l,
  },
  membersMain: {
    paddingBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },
  membersCount: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  sectionTitle: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    paddingTop: theme.spacing.m,
    // paddingHorizontal: theme.spacing.l,
    // paddingHorizontal: theme.spacing.l,
  },
  manageMembers: {
    color: theme.colors.secondary,
    textDecorationLine: 'underline',
  },
  membersAdd: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.secondaryAlt,
    paddingHorizontal: theme.spacing.l,
    alignItems: 'center',
  },
  membersAddText: {
    color: theme.colors.white,
    flex: 1,
    paddingRight: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
  membersAddButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xs,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,

    /* shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    elevation: 4,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 2 },
     */
  },
  membersAddButtonLabel: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.s,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },
  membersList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.l,
  },
  membersAddButtonAlt: {
    alignItems: 'center',
  },
  membersAddButtonAltIconBlock: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xxl,
    width: 42,
    height: 42,
    justifyContent: 'center',
  },
  membersAddButtonAltIcon: {
    textAlign: 'center',
    color: theme.colors.primary,
  },
  membersAddButtonAltLabel: {
    fontSize: theme.fontSizes.s,
    textAlign: 'center',
    color: theme.colors.white,
    paddingTop: theme.spacing.xs,
  },
  memberAvatars: {
    alignItems: 'flex-end',
  },
  avatars: {
    width: '100%',
    paddingBottom: 10,
  },
  avatar: {
    ...sharredStyles.avatarCommon,
    marginLeft: -3,
    zIndex: 1,
  },
  avatarInGroup: {
    // avatar
    width: 42,
    height: 42,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#fff',

    marginLeft: -10,
  },
  stepsContainer: {
    paddingTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
  complains: {
    paddingVertical: theme.spacing.l,
    // paddingHorizontal: theme.spacing.l,
  },
  complainsTitle: {
    paddingHorizontal: theme.spacing.l,
    /* paddingTop: theme.spacing.l, */
    paddingBottom: theme.spacing.l,
  },
  complainsBlock: {
    minHeight: 140,
  },
  complainsEmpty: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondaryAlt,
  },
  footer: {
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
  groupDelete: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.red,
  },
  startedDate: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.secondary,
  },
  complain: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.l,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  reportedMessage: {
    width: '100%',
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
  reportedUser: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingBottom: theme.spacing.m,
  },
  reportedUserAvatar: {
    ...sharredStyles.avatarCommon,
    width: 36,
    height: 36,
  },
  reportedUserName: {
    paddingLeft: theme.spacing.s,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.secondary,
  },
  reportedMessageContent: {
    minHeight: 60,
    justifyContent: 'center',
  },
  reportedMessageText: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
    textAlign: 'center',
    paddingBottom: theme.spacing.m,
  },
  reportedMessageSecondary: {
    backgroundColor: theme.colors.secondary,
    // flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
  },
  reporter: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    opacity:.75,
  },
  reporterAvatar: {
    ...sharredStyles.avatarCommon,
    width: 28,
    height: 28,
    borderWidth: 1.25,
  },
  reporterName: {
    paddingHorizontal: theme.spacing.s,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.white,
  },
  reportedComment: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.white,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.m,
  },
  complainActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l,
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: theme.spacing.xs,
  },
  complainActionBlock: {
    ...sharredStyles.smallButton,
  },
  complainActionAllow: {
    ...sharredStyles.smallButton,
  },
  complainActionBlockLabel: {
    ...sharredStyles.smallButtonLabel,
    color: theme.colors.red,
  },
  complainActionAllowLabel: {
    ...sharredStyles.smallButtonLabel,
    color: theme.colors.green,
  },

  /* modalTitleArea: {
    paddingBottom: theme.spacing.s,
    flexDirection: 'row',
  }, */
});

export default styles;
