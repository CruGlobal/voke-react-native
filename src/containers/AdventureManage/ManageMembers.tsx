import React from 'react';
import { Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Communications from 'react-native-communications';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import OldButton from '../../components/OldButton';
import VokeIcon from '../../components/VokeIcon';
import Image from '../../components/Image';
import { TAdventureSingle, TMessenger, TUser } from '../../types';

import styles from './styles';

interface Invite {
  id: string;
  name: string;
  code: string;
}

interface Props {
  messengers: TMessenger[];
  me: TUser;
  adventure: TAdventureSingle;
}

const ManageMembers = ({
  messengers,
  me,
  adventure,
}: Props): React.ReactElement => {
  const { t } = useTranslation('manageGroup');
  const navigation = useNavigation();
  const myUser: TMessenger | undefined = messengers.find(
    (i: TMessenger) => i.id === me.id,
  );
  const myAvatar = myUser ? myUser?.avatar?.small : '';
  // eslint-disable-next-line camelcase
  const inviteItem: Invite = adventure?.journey_invite;
  // Move preview_journey_url from parent into the inviteItem data structure.
  // Don't delete unless Pablo moves preview_journey_url from adventure to inviteItem.
  if (!inviteItem?.preview_journey_url && adventure?.preview_journey_url) {
    inviteItem.preview_journey_url = adventure?.preview_journey_url;
  }

  const otherUsers =
    messengers.filter(i => i.id !== me.id && i.first_name !== 'VokeBot') || [];

  const totalGroupUsers = otherUsers.length;
  let subGroup = otherUsers;
  let numberMore = 0;
  if (totalGroupUsers > 7) {
    subGroup = otherUsers.slice(0, 6);
    numberMore = totalGroupUsers - 7;
  }

  const addMembers = async (invite: Invite): Promise<void> => {
    try {
      /* Before we show a screen with invite code,
      check if it's expired.
      Renew invite on the server if it is expired.
      Otherwise go ahead and show a screen with a share code. */
      // const { isTimeExpired } = getExpiredTime(invite.expires_at);
      // let readyToShare = true;
      // if (isTimeExpired) {
      // readyToShare = false;
      // const result = await dispatch(resendAdventureInvitation(invite.id));
      /* if (!result.error) {
          readyToShare = true;
        } else {
          throw false;
        } */
      // }

      // if (readyToShare) {
      navigation.navigate('AdventureShareCode', {
        invitation: invite,
        withGroup: true,
        isVideoInvite: false,
      });
      // }
    } catch (error) {
      Alert.alert(
        'Failed to send a new invite',
        'Please, check your internet connection and try again.',
        [
          {
            text: t('settings:email'),
            onPress: (): void => {
              Communications.email(
                ['support@vokeapp.com'], // TO
                null, // CC
                null, // BCC
                'Voke App Error: Failed to send a new invite', // SUBJECT
                `I'm getting 'Failed to send a new invite' error when inviting more members into my group.
                My account email is: ...
                Group invite code is: ... `, // BODY
              );
            },
          },
          {
            text: t('ok'),
            onPress: (): void => {
              // No action.
            },
          },
        ],
      );
    }
  };

  return (
    <View style={styles.members}>
      <Flex
        direction="row"
        align="center"
        justify="between"
        style={styles.membersMain}
      >
        <Text style={styles.membersCount}>
          {otherUsers.length ? otherUsers.length + ' ' : ''}
          {otherUsers.length
            ? t('members', { count: otherUsers.length })
            : t('noMembers')}
        </Text>
        <Touchable
          isAndroidOpacity={true}
          onPress={(): void =>
            navigation.navigate('AllMembersModal', {
              adventureId: adventure.id,
              isJoined: true,
            })
          }
        >
          <Text style={styles.manageMembers}>{t('manageMembers')}</Text>
        </Touchable>
      </Flex>
      {otherUsers.length ? (
        <View style={styles.membersList}>
          <OldButton
            onPress={(): void => {
              addMembers(inviteItem);
            }}
            style={styles.membersAddButtonAlt}
            testID="ctaAddMembers"
          >
            <View style={styles.membersAddButtonAltIconBlock}>
              <VokeIcon
                name={'plus'}
                size={20}
                style={styles.membersAddButtonAltIcon}
              />
            </View>
            <Text style={styles.membersAddButtonAltLabel}>
              {t('addMembers')}
            </Text>
          </OldButton>
          <Touchable
            isAndroidOpacity={true}
            onPress={(): void =>
              navigation.navigate('AllMembersModal', {
                adventureId: adventure.id,
                isJoined: true,
              })
            }
          >
            <Flex align="center" style={styles.memberAvatars}>
              {/* Rendered backwards to make a stack look natural */}
              {numberMore ? (
                <View style={styles.pseudoAvatar}>
                  <Text style={styles.pseudoAvatarNum}>+{numberMore}</Text>
                </View>
              ) : (
                <></>
              )}
              {subGroup.map(i => (
                <Image uri={i?.avatar?.small} style={styles.avatarInGroup} />
              ))}
              <Image uri={myAvatar} style={styles.avatar} />
            </Flex>
          </Touchable>
        </View>
      ) : (
        <View style={styles.membersAdd}>
          <Text style={styles.membersAddText}>{t('noMembersYet')}</Text>
          <OldButton
            onPress={(): void => {
              addMembers(inviteItem);
            }}
            style={styles.membersAddButton}
            testID="ctaAddMembersEmpty"
          >
            <Text style={styles.membersAddButtonLabel}>{t('addMembers')}</Text>
          </OldButton>
        </View>
      )}
    </View>
  );
};

export default ManageMembers;
