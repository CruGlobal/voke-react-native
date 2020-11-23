import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const sharredStyles = {
  avatarCommon: {
    width: 42,
    height: 42,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: theme.colors.primary,
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
  },
  complainActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l,
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: theme.spacing.xs,
  },
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.primary,
  },
  header: {},
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
    width: 40,
    height: 40,
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
    flexDirection: 'row-reverse',
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
    ...sharredStyles.avatarCommon,
    marginLeft: -10,
  },
  pseudoAvatar: {
    ...sharredStyles.avatarCommon,
    marginLeft: -10,
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  pseudoAvatarNum: {
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.semiBold,
    lineHeight: theme.fontSizes.l * 1.3,
    color: theme.colors.white,
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
    opacity: 0.75,
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
    ...sharredStyles.complainActions,
  },
  /*  complainActionsInactive: {
    ...sharredStyles.complainActions,
    opacity:.5,
  }, */
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
  complainActionIcon: {
    color: theme.colors.primary,
    paddingBottom: theme.spacing.s,
  },

  modalStyle: {
    backgroundColor: 'transparent',
    marginHorizontal: theme.spacing.s,
  },
  childrenStyle: {
    // backgroundColor: 'rgba(255,255,255,.3)',
    borderRadius: theme.radius.l,
    overflow: 'hidden',
  },
  modalContent: {
    minHeight: '100%',
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },
  modalActions: {
    paddingBottom: theme.spacing.s,
  },
  actionButton: {
    backgroundColor: theme.colors.white,
    marginTop: theme.spacing.s,
    borderRadius: theme.radius.l,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonLabel: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
  },
  modalBlurAndroid: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.white,
  },
  modalBlur: {
    ...StyleSheet.absoluteFill,
  },
  modalTitle: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    paddingBottom: theme.spacing.m,
    paddingVertical: theme.spacing.l,
  },
  modalText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    textAlign: 'center',
  },
  confirmationIcon: {
    color: theme.colors.green,
    alignSelf: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  confirmationTitle: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.4,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  confirmationText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    textAlign: 'center',
  },

  /* modalTitleArea: {
    paddingBottom: theme.spacing.s,
    flexDirection: 'row',
  }, */
});

export default styles;
