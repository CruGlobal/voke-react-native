import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, View } from 'react-native';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import theme from '../../theme';
import Triangle from '../../components/Triangle';
import OldButton from '../../components/OldButton';
import Touchable from '../../components/Touchable';
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';

import styles from './styles';

function GroupModal(props) {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const me = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const adventureId = props.route.params.adventureId;
  // We update local adventures when accepting invite.
  // If no adventures in the local store at this point - we have a problem.
  const myAdventures = useSelector(({ data }) => data.myAdventures.byId);
  const adventure = myAdventures[adventureId];
  if ( !adventure ) {
    console.log('will redirect');
    // Backup plan: Redirect to My Adventures screen.
    navigation.reset({
              index: 0,
              routes: [{ name: 'LoggedInApp' }],
            });
    return <></>;
  }
  const allMessengers = adventure?.conversation?.messengers;
  const messengers = allMessengers.filter(
    i => i.first_name !== 'VokeBot' && (i || {}).id !== (me || {}).id,
  );
  const hasMoreMembers = messengers.length > 5;

  if (messengers.length < 5) {
    for (let m; messengers.length < 5; m++) {
      messengers.push({ first_name: '' });
    }
  }

  const smallCircle = st.fullWidth / 2 - 90;
  const smallBox = st.fullWidth / 2 - 50;
  const largeCircle = st.fullWidth / 2 - 80;
  const largeBox = st.fullWidth / 2 - 30;

  const handleJoinGroup = (): void => {
    // Go to the adventure steps screen.
    navigation.navigate('AdventureActive', {
      adventureId: adventureId,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Flex style={[st.mb4]}>
        <Flex align="center" justify="center" style={styles.title}>
          <Flex >
            <Text style={[st.white, st.fs16, st.tac, {marginBottom: theme.spacing.s}]}>
              {t('modal:welcomeTo')}
              {adventure.journey_invite.name || adventure.name || ''}!
            </Text>
          </Flex>
          <Flex
            align="start"
            justify="start"
            style={[st.w(st.fullWidth - 100)]}
          >
            <Triangle
              width={20}
              height={15}
              color={st.colors.offBlue}
              slant="down"
              flip={true}
              style={[st.rotate(90), st.mt(-6)]}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex align="center" justify="center" style={[]}>
        <Flex
          direction="row"
          wrap="wrap"
          align="end"
          justify="end"
          style={[st.w(st.fullWidth - 20)]}
        >
          {messengers.slice(0, 5).map((messenger, index) => (
            <Flex
              key={messenger.id}
              direction="column"
              align="center"
              justify="center"
              style={[
                st.bgOffBlue,
                st.m5,
                {
                  width: index === 0 ? largeBox : smallBox,
                  height: index === 0 ? largeBox : smallBox,
                  marginRight: 15,
                  paddingVertical: theme.spacing.l,
                },
              ]}
            >
              {!messenger.avatar ? (
                <Flex align="center" justify="center" style={[st.pt3]}>
                  <VokeIcon name="person" size={80} style={[st.white]} />
                </Flex>
              ) : (
                <Image
                  resizeMode="contain"
                  source={{ uri: messenger.avatar.medium }}
                  style={[
                    {
                      height: index === 0 ? largeCircle : smallCircle,
                      width: index === 0 ? largeCircle : smallCircle,
                      borderRadius:
                        index === 0 ? largeCircle / 2 : smallCircle / 2,
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
                  textAlign:'center',
                }}
                numberOfLines={1}
              >
                {messenger.first_name}
              </Text>
            </Flex>
          ))}
          <Flex
            direction="column"
            align="center"
            style={[
              st.bgOrange,
              st.m5,
              {
                width: smallBox,
                height: smallBox,
              },
            ]}
          >
            <Touchable
              onPress={(): void => handleJoinGroup()}
              style={{
                flex: 1,
                width: '100%',
                padding: theme.spacing.s,
              }}
            >
              <>
                <Flex
                  value={1}
                  justify="end"
                  style={{
                    paddingBottom: theme.spacing.s,
                    paddingLeft: theme.spacing.s,
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={{ uri: me.avatar.large }}
                    style={[
                      {
                        height: smallBox / 2.5,
                        width: smallBox / 2.5,
                        borderRadius: 100,
                      },
                    ]}
                  />
                </Flex>
                <Flex
                  direction="row"
                  align="center"
                  justify="between"
                  value={1}
                  self="stretch"
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        st.white,
                        st.tal,
                        {
                          paddingLeft: theme.spacing.s,
                          fontSize: st.isAndroid
                            ? theme.fontSizes.m
                            : theme.fontSizes.xl,
                          lineHeight: st.isAndroid
                            ? theme.fontSizes.l
                            : theme.fontSizes.xxl,
                        },
                      ]}
                    >
                      {t('joinGroup')}
                    </Text>
                  </View>
                  <VokeIcon
                    name="arrow-left2"
                    size={30}
                    style={{
                      transform: [{ rotate: '180deg' }],
                      color: theme.colors.white,
                    }}
                  />
                </Flex>
              </>
            </Touchable>
          </Flex>
        </Flex>
      </Flex>
      {hasMoreMembers ? (
        <Flex align="center" self="stretch">
          <OldButton
            onPress={() =>
              navigation.navigate('AllMembersModal', {
                adventure,
                isJoined: false,
              })
            }
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
              <Text style={[st.white, st.fs16]}>{t('allMembers')}</Text>
            </Flex>
          </OldButton>
        </Flex>
      ) : null}
    </ScrollView>
  );
}

export default GroupModal;
