/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions, ScrollView, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { StackNavigationProp } from '@react-navigation/stack';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Image from 'components/Image';
import StatusBar from 'components/StatusBar';
import HeaderSpacer from 'components/HeaderSpacer';
import Button from 'components/Button';
import OldButton from 'components/OldButton';
import Touchable from 'components/Touchable';
import VokeIcon from 'components/VokeIcon';
import Spacer from 'components/Spacer';
import theme from 'utils/theme';
import st from 'utils/st';
import { isAndroid } from 'utils/constants';
import {
  AdventureStackParamList,
  TAdventureSingle,
  TDataState,
  TMessenger,
} from 'utils/types';

import { deleteMember, getMyAdventure } from '../../../actions/requests';

import styles from './styles';

type NavigationPropType = StackNavigationProp<
  AdventureStackParamList,
  'AllMembersModal'
>;

type RoutePropType = RouteProp<AdventureStackParamList, 'AllMembersModal'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

function AllMembersModal(props: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const modalizeRef = useRef<Modalize>(null);
  const { height } = Dimensions.get('window');
  const me = useSelector(({ auth }) => auth.user);
  const {
    adventureId,
    isJoined,
  }: {
    adventureId: string; // TAdventureSingle;
    isJoined: boolean;
  } = props.route.params;

  const adventure: TAdventureSingle = useSelector(
    ({ data }: { data: TDataState }) =>
      data.myAdventures?.byId[
        adventureId as keyof TDataState['myAdventures']['byId']
      ] || {},
  );

  // const adventureId = props.route.params.adventure.messenger_journey_id;
  const allMessengers = adventure?.conversation?.messengers;

  const [messengers, setMessengers] = useState<TMessenger[]>([]);
  const [isLeaderView, setIsLeaderView] = useState(false);
  interface TDeleteUser {
    deleted: boolean;
    conversationId: string;
    messengerId: string;
    first_name: string;
  }

  const noUser = {
    deleted: false,
    conversationId: '',
    messengerId: '',
    first_name: '',
  };
  const [deleteUser, setDeleteUser] = useState<TDeleteUser>(noUser);

  const smallCircle = st.fullWidth / 2 - 90;

  const handleJoinGroup = (): void => {
    // Go to the adventure steps screen.
    navigation.navigate('AdventureActive', {
      adventureId: adventureId,
    });
  };

  useEffect(() => {
    setMessengers(allMessengers.filter((i) => i.first_name !== 'VokeBot'));
  }, [allMessengers.length, allMessengers]);

  useEffect(() => {
    setIsLeaderView(
      messengers.find((i) => i.id === me.id && i.group_leader) !== undefined ||
        false,
    );
  }, [messengers.length, messengers, me.id]);

  useEffect(() => {
    // Set title dynamically.
    navigation.setOptions({
      title: adventure.journey_invite?.name || adventure?.name || '',
    });
  }, [adventure.journey_invite?.name, adventure?.name, navigation]);

  const onDeleteMember = async ({
    conversationId,
    messenger,
  }: {
    conversationId: string;
    messenger: TMessenger;
  }): Promise<void> => {
    modalizeRef.current?.open();
    setDeleteUser({
      deleted: false,
      conversationId: conversationId,
      messengerId: messenger.id,
      first_name: messenger.first_name,
    });
  };

  const onConfirmDelete = async ({
    conversationId,
    messengerId,
    // eslint-disable-next-line no-shadow
    adventureId,
  }: {
    conversationId: string;
    messengerId: string;
    adventureId: string;
  }): Promise<void> => {
    const result = await dispatch(
      deleteMember({
        conversationId: conversationId,
        messengerId: messengerId,
      }),
    );

    if (result['blocked?']) {
      // Remove element instantly
      // without waiting for an adventure update from the server.
      messengers.splice(
        messengers.findIndex((i) => i.id === messengerId),
        1,
      );
      setMessengers(() => messengers.splice(0, messengers.length));
      // Update current adventure to reflect changes.
      dispatch(getMyAdventure(adventureId));
      setDeleteUser((user) => ({ ...user, deleted: true }));
    }
  };

  const closeModal = (): void => {
    setDeleteUser(noUser);
    modalizeRef.current?.close();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <HeaderSpacer />
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <Flex style={[st.mb4]}>
          <Flex align="center" justify="center">
            <Flex align="center" self="stretch">
              {isJoined ? (
                <>
                  {adventure.journey_invite?.code ? (
                    <Flex align="center" justify="center">
                      <Text style={styles.invite}>
                        {t('inviteCode')}:{' '}
                        <Text style={styles.inviteCode}>
                          {adventure.journey_invite.code}
                        </Text>
                      </Text>
                    </Flex>
                  ) : null}
                </>
              ) : (
                <OldButton
                  onPress={handleJoinGroup}
                  style={[
                    st.bgOrange,
                    st.ph6,
                    st.pv5,
                    st.bw0,
                    st.br3,
                    st.mt5,
                    st.aic,
                    { width: st.fullWidth - 90 },
                  ]}
                >
                  <Flex direction="row" align="center">
                    <Text style={[st.white, st.fs16]}>{t('joinGroup')}</Text>
                  </Flex>
                </OldButton>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center" justify="center" style={styles.members}>
          <Flex direction="row" wrap="wrap" justify="center">
            {messengers.map((messenger, index) => (
              <View
                style={
                  messenger.group_leader
                    ? styles.adminOuter
                    : styles.memberOuter
                }
              >
                <Flex
                  key={messenger.id}
                  direction="column"
                  style={
                    messenger.group_leader
                      ? styles.adminInner
                      : styles.memberInner
                  }
                >
                  {isLeaderView && !messenger.group_leader ? (
                    <Touchable
                      style={styles.iconDeleteBlock}
                      //TODO: Hook up Remove
                      onPress={(): void => {
                        onDeleteMember({
                          conversationId: adventure.conversation.id,
                          messenger,
                        });
                      }}
                    >
                      <VokeIcon
                        name="close-circle"
                        size={34}
                        style={styles.iconDelete}
                      />
                    </Touchable>
                  ) : null}

                  {!messenger.avatar ? (
                    <Flex align="center" justify="center" style={[st.pt3]}>
                      <Image
                        resizeMode="contain"
                        source={DEFAULT_AVATAR}
                        style={{
                          height: smallCircle,
                          width: smallCircle,
                          borderRadius: smallCircle / 2,
                          borderWidth: st.isAndroid || index !== 0 ? 1 : 2,
                          borderColor: st.colors.white,
                        }}
                      />
                    </Flex>
                  ) : (
                    <Image
                      resizeMode="contain"
                      source={{ uri: messenger.avatar.medium }}
                      style={[
                        {
                          height: smallCircle,
                          width: smallCircle,
                          borderRadius: smallCircle / 2,
                          borderWidth: 2,
                          borderColor: st.colors.white,
                        },
                      ]}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: theme.fontSizes.l,
                      paddingTop: 3,
                      color: theme.colors.white,
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                  >
                    {messenger.first_name}
                  </Text>
                </Flex>
              </View>
            ))}
          </Flex>
          <Portal>
            <Modalize
              ref={modalizeRef}
              modalTopOffset={height > 600 ? height / 6 : 0}
              handlePosition={'inside'}
              openAnimationConfig={{
                timing: { duration: 300 },
              }}
              onClose={(): void => {
                // clearComplain();
              }}
              rootStyle={{
                elevation: 5, // need it here to solve issue with button shadow.
              }}
              modalStyle={styles.modalStyle}
              childrenStyle={styles.childrenStyle}
              adjustToContentHeight={true}
              disableScrollIfPossible={height > 600 ? true : false}
            >
              <SafeAreaView edges={['bottom']}>
                {isAndroid ? (
                  <View style={styles.modalBlurAndroid} />
                ) : (
                  <BlurView blurType="xlight" style={styles.modalBlur} />
                )}
                <View style={styles.modalContent}>
                  {deleteUser?.deleted ? (
                    <>
                      <VokeIcon
                        name="check_circle"
                        style={styles.confirmationIcon}
                        size={50}
                      />
                      <Text style={styles.confirmationTitle}>
                        {t('modal:deleteUserConfrimationTitle', {
                          name: deleteUser?.first_name || t('modal:user'),
                        })}
                      </Text>
                      <Text style={styles.confirmationText}>
                        {t('modal:deleteUserConfrimationText', {
                          name: deleteUser?.first_name || t('modal:thisUser'),
                        })}
                      </Text>
                      <Spacer size="xl" />
                      <Button
                        onPress={(): void => closeModal()}
                        testID={'ctaDone'}
                        size="m"
                        radius="m"
                        color="secondary"
                      >
                        {t('done')}
                      </Button>
                      <Spacer size="l" />
                    </>
                  ) : (
                    <>
                      <Text style={styles.modalTitle}>
                        {t('modal:deleteUserSure')}
                      </Text>
                      <Text style={styles.modalText}>
                        {t('modal:deleteUserWarning')}
                      </Text>
                      <Spacer size="l" />
                      <Button
                        onPress={(): void => {
                          onConfirmDelete({
                            conversationId: deleteUser.conversationId,
                            messengerId: deleteUser.messengerId,
                            adventureId: adventureId,
                          });
                        }}
                        size="m"
                        radius="m"
                        color="secondary"
                      >
                        {t('modal:removeMember')}
                      </Button>
                      <Spacer size="m" />
                      <Button
                        onPress={(): void => closeModal()}
                        disabled={deleteUser?.deleted ? true : false}
                        size="s"
                        radius="m"
                        color="transparentSecondary"
                      >
                        {t('cancel')}
                      </Button>
                      <Spacer size="l" />
                    </>
                  )}
                </View>
              </SafeAreaView>
            </Modalize>
          </Portal>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AllMembersModal;
