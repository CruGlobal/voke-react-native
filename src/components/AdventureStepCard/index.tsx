import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../reducers';
import Image from '../Image';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import st from '../../st';
import { getCurrentUserId } from '../../utils/get';

import styles from './styles';

type StepProps = {
  status: string;
  // eslint-disable-next-line camelcase
  unread_messages: number;
  'completed_by_messenger?': boolean;
};

type AdventureStepCardProps = {
  stepId: string;
  adventureId: string;
};

// Renders Cards on this screen https://d.pr/i/WsCCf2
function AdventureStepCard({
  stepId,
  adventureId,
}: AdventureStepCardProps): React.ReactElement {
  const { t } = useTranslation('journey');
  const navigation = useNavigation();
  const userId = getCurrentUserId();
  const adventure = useSelector(
    ({ data }: RootState) => data.myAdventures?.byId[adventureId] || {},
  );
  const step = useSelector(
    ({ data }: RootState) =>
      data.adventureSteps[adventureId]?.byId[stepId] || {},
  );

  const [isActive, setIsActive] = useState(step?.status === 'active');
  const [isCompleted, setIsCompleted] = useState(step?.status === 'completed');
  const [isWaiting, setIsWaiting] = useState(
    isActive && step['completed_by_messenger?'],
  );
  const [isLocked, setIsLocked] = useState(!isCompleted && !isActive);
  const messengers = (adventure?.conversation || {}).messengers || [];
  const thumbnail = useMemo(
    () => (step?.item?.content?.thumbnails?.medium || ''),
    [stepId],
  );
  // TODO: adventure can be undefined.
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'multiple';

  const inviteName = adventure?.journey_invite?.name;
  let invitedUserName = '';

  const otherUser = messengers.find(
    i => i.id !== userId && i.first_name !== 'VokeBot',
  );

  if (otherUser && otherUser.first_name) {
    invitedUserName = otherUser.first_name;
  } else if (inviteName) {
    invitedUserName = inviteName;
  }

  // Monitor any changes in steps and step parammeters of the component
  // to update the card elements accordingly.
  // For example we need to update unread count on the card when state changed.
  useEffect(() => {
    setIsActive(step.status === 'active');
    setIsCompleted(step.status === 'completed');
    setIsWaiting(step.status === 'active' && step['completed_by_messenger?']);
    setIsLocked(step.status !== 'completed' && step.status !== 'active');
  }, [step]);

  return (
    <Flex style={styles.stepWrapper}>
      <Touchable
        highlight={false}
        disabled={isLocked}
        activeOpacity={0.8}
        onPress={(): void =>
          navigation.navigate('AdventureStepScreen', {
            stepId: step.id,
            adventureId: adventure.id,
          })
        }
        style={styles.stepCard}
      >
        <Flex
          style={[
            isActive ? st.bgWhite : st.bgOffBlue,
            isLocked ? st.op50 : null,
            st.br5,
          ]}
          align="center"
          justify="start"
          // direction="row"
        >
          <Flex direction="row" style={styles.cardContent}>
            <Flex style={styles.thumbContainer}>
              <Image
                // source={thumbnail}
                uri={thumbnail}
                style={styles.thumb}
                resizeMode="cover"
              />
              <VokeIcon
                name={isLocked ? 'lock' : 'play-full'}
                size={30}
                style={styles.thumbIcon}
              />
            </Flex>
            <Flex
              value={1}
              direction="column"
              self="start"
              style={styles.content}
            >
              <Text
                numberOfLines={2}
                style={isActive ? styles.titleActive : styles.titleInactive}
              >
                {step.name}
              </Text>
              <Text style={isActive ? styles.partActive : styles.partInactive}>
                {t('part')} {step.position}
              </Text>
              {/* {isActive || isCompleted ? ( */}
              {/* UNREAD COUNTER */}
              {step.unread_messages && !isSolo ? (
                <Flex
                  direction="row"
                  align="center"
                  // justify="left"
                  self="start"
                  style={[
                    st.br2,
                    st.bgOrange,
                    st.mr4,
                    st.mt5,
                    st.p6,
                    st.pl5,
                    st.pr5,
                    {
                      // position: "absolute",
                      // right: -2,
                      // top: 0,
                    },
                  ]}
                >
                  <VokeIcon
                    name="speech-bubble-full"
                    style={styles.iconUnread}
                    size={14}
                  />
                  <Text style={[st.white, { fontWeight: 'bold' }]}>
                    {step.unread_messages > 99 ? '99' : step.unread_messages}
                  </Text>
                </Flex>
              ) : null}
              {/* <Flex direction="row" align="center" style={[st.pt6]}>
                <VokeIcon
                  name="speech-bubble-full"
                  style={[
                    step.unread_messages && !isSolo ? st.orange : isCompleted ? st.white : st.charcoal,
                  ]}
                />
                {step.unread_messages && !isSolo ? (
                  <Flex
                    align="center"
                    justify="center"
                    style={[st.circle(20), st.bgOrange, st.ml6]}
                  >
                    <Text style={[st.white]}>
                      {step.unread_messages > 99 ? '99' : step.unread_messages}
                    </Text>
                  </Flex>
                ) : null}
              </Flex> */}
            </Flex>
            <Flex style={styles.stepNumberContainer}>
              <Text
                style={[isWaiting ? st.orange : st.blue, styles.stepNumber]}
              >
                {step.position}
              </Text>
            </Flex>
          </Flex>
          {isWaiting && messengers.length > 2 ? (
            <Flex
              align="center"
              style={[st.bgOrange, st.w100, st.pd6, st.brbl5, st.brbr5]}
            >
              {
                <Text style={[st.fs4]}>
                  {t('waitingForAnswer', { name: invitedUserName })}
                </Text>
              }
            </Flex>
          ) : null}
        </Flex>
      </Touchable>
      {/* {isLocked ? null : (
      <Flex
        style={[
          st.absbr,
          st.isAndroid ? st.bottom(10) : st.bottom(15),
          st.right(15),
          st.mh5,
        ]}
      >
        <Button
          type="transparent"
          isAndroidOpacity
          onPress={(): void => {}}
          activeOpacity={0.6}
          touchableStyle={[st.abs, st.right(15), st.top(-35), st.mh5]}
        >
          <VokeIcon
            type="image"
            name="to-chat"
            style={{ width: 50, height: 50 }}
          />
        </Button>
      </Flex>
    )} */}
      {isCompleted ? (
        <Flex
          style={[
            st.abs,
            st.top(-8),
            st.right(-10),
            st.bgDarkerBlue,
            st.pd6,
            st.br2,
          ]}
        >
          <VokeIcon
            name="checkmark-outline"
            size={16}
            style={styles.iconCompleted}
          />
        </Flex>
      ) : null}
    </Flex>
  );
}

export default AdventureStepCard;
