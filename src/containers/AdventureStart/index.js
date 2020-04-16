import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import Triangle from '../../components/Triangle';
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import VOKE_BOT from '../../assets/voke_bot_face_large.png';
import Touchable from '../../components/Touchable';
import { startAdventure } from '../../actions/requests';

function AdventureStart(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { item, alreadyStartedByMe } = props.route.params;

  async function startByMyself() {
    try {
      setIsLoading(true);
      const result = await dispatch(
        startAdventure({ organization_journey_id: item.id }),
      );
      console.log('result', result);
      // dispatch(
      //   navigatePush(
      //     'voke.VideoContentWrap',
      //     {
      //       item: result,
      //       journey: item,
      //       shouldNavigateHome: true,
      //       type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
      //       trackingObj: buildTrackingObj('journey : mine', 'detail'),
      //     },
      //     VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
      //   ),
      // );
    } catch (e) {
      console.log('Error starting adventure by myself', e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Flex
      style={[st.aic, st.w100, st.jcsb, st.bgBlue, { paddingTop: insets.top }]}
    >
      <Flex direction="column" justify="start" style={[st.w100, st.h100]}>
        <Flex direction="column" self="stretch">
          <Touchable
            style={[st.p5, st.pl4, st.mb3]}
            onPress={() => navigation.goBack()}
          >
            <VokeIcon
              type="image"
              name="buttonArrow"
              style={[st.rotate('180deg'), st.h(22), st.w(22)]}
            />
          </Touchable>
          <Flex
            direction="row"
            align="start"
            justify="between"
            style={[st.mb4, st.h(180)]}
          >
            <Flex justify="end" self="stretch" style={[]}>
              <Image
                source={VOKE_BOT}
                resizeMode="contain"
                style={[
                  st.w(80),
                  st.h(120),
                  { transform: [{ rotateY: '180deg' }] },
                ]}
              />
            </Flex>
            <Flex direction="column" value={1} justify="start" style={[st.pr1]}>
              <Flex style={[st.bgOffBlue, st.ph3, st.pv5, st.br5]}>
                <Text style={[st.white, st.fs20, st.tac]}>
                  How would you like to start this adventure?
                </Text>
              </Flex>
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
          <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
            <Button
              isAndroidOpacity={true}
              style={[
                st.pd4,
                st.br1,
                st.bgOrange,
                st.w(st.fullWidth - 50),
                st.mt2,
              ]}
              onPress={() =>
                navigation.navigate('AdventureName', {
                  item,
                  withGroup: false,
                })
              }
            >
              <Flex
                direction="row"
                align="center"
                justify="between"
                style={[st.ph1]}
              >
                <VokeIcon type="image" name="withFriend" />
                <Text style={[st.white, st.fs20]}>With a Friend</Text>
                <VokeIcon type="image" name="buttonArrow" />
              </Flex>
            </Button>
            <Button
              isAndroidOpacity={true}
              style={[
                st.pd4,
                st.br1,
                st.bgOrange,
                st.w(st.fullWidth - 50),
                st.mt2,
              ]}
              onPress={() =>
                navigation.navigate('AdventureName', {
                  item,
                  withGroup: true,
                })
              }
            >
              <Flex
                direction="row"
                align="center"
                justify="between"
                style={[st.ph1]}
              >
                <VokeIcon type="image" name="withGroup" />
                <Text style={[st.white, st.fs20]}>With a Group</Text>
                <VokeIcon type="image" name="buttonArrow" />
              </Flex>
            </Button>
            {alreadyStartedByMe ? null : (
              <Button
                isAndroidOpacity={true}
                style={[
                  st.pd4,
                  st.br1,
                  st.bgOrange,
                  st.w(st.fullWidth - 50),
                  st.mt2,
                ]}
                onPress={startByMyself}
              >
                <Flex
                  direction="row"
                  align="center"
                  justify="between"
                  style={[st.ph1]}
                >
                  <VokeIcon type="image" name="byMyself" />
                  <Text style={[st.white, st.fs20]}>By Myself</Text>
                  <VokeIcon type="image" name="buttonArrow" />
                </Flex>
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AdventureStart;
