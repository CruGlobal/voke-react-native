import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Image from '../Image';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import st from '../../st';
import { TAdventureSingle, TStep } from '../../types';

type StepProps = {
  status: string;
  // eslint-disable-next-line camelcase
  unread_messages: number;
  'completed_by_messenger?': boolean;
};

type AdventureStepCardProps = {
  step: TStep;
  steps: StepProps[];
  adventure: TAdventureSingle;
};

// Renders Cards on this screen https://d.pr/i/WsCCf2
function AdventureStepCard({
  step,
  steps,
  adventure,
}: AdventureStepCardProps): React.ReactElement {
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(step.status === 'active');
  const [isCompleted, setIsCompleted] = useState(step.status === 'completed');
  const [isWaiting, setIsWaiting] = useState(
    isActive && step['completed_by_messenger?']
  );
  const [unreadCount, setUnreadCount] = useState(step.unread_messages);
  const [isLocked, setIsLocked] = useState(!isCompleted && !isActive);
  const [hasUnread, setHasUnread] = useState(unreadCount > 0);
  // Monitor any changes in steps and step parammeters of the component
  // to update the card elements accordingly.
  // For example we need to update unread count on the card when state changed.
  useEffect(() => {
    setIsActive(step.status === 'active');
    setIsCompleted(step.status === 'completed');
    setIsWaiting(step.status === 'active' && step['completed_by_messenger?']);
    setUnreadCount(step.unread_messages);
    setIsLocked(step.status !== 'completed' && step.status !== 'active');
    setHasUnread(step.unread_messages > 0);
  }, [steps, step]);

  const messengers = (adventure.conversation || {}).messengers || [];
  const thumbnail = (((step.item || {}).content || {}).thumbnails || {}).small;
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'multiple';

  // if (messengers.length === 2 && inviteName) {
  //   otherUser = { first_name: inviteName };
  // }

  return (
    <Touchable
      highlight={false}
      disabled={isLocked}
      activeOpacity={0.8}
      onPress={(): void =>
        navigation.navigate('AdventureStepScreen', {
          stepId: step.id,
          adventure: adventure,
        })
      }
    >
      <Flex
        style={[
          isActive ? st.bgWhite : st.bgOffBlue,
          isLocked ? st.op50 : null,
          st.mv6,
          st.mh4,
          st.br5,
        ]}
        align="center"
        justify="start"
      >
        <Flex direction="row" style={[st.minh(84)]}>
          <Flex style={[st.m5, st.rel]}>
            <Image
              source={{ uri: thumbnail }}
              style={[st.w(100), st.f1]}
              resizeMode="contain"
            />
            <Flex style={[st.absfill]} align="center" justify="center">
              <VokeIcon
                type={isLocked ? 'image' : undefined}
                name={isLocked ? 'lock' : 'icon-play'}
                size={30}
                style={[st.op90, st.w(30), st.h(30)]}
              />
            </Flex>
          </Flex>
          <Flex value={1} direction="column" self="start" style={[st.pv6]}>
            <Text
              numberOfLines={1}
              style={[st.fs4, isActive ? st.darkBlue : st.white]}
            >
              {step.name}
            </Text>
            <Text style={[st.fs5, isActive ? st.darkBlue : st.white]}>
              Part {step.position}
            </Text>
            {isActive || isCompleted ? (
              <Flex direction="row" align="center" style={[st.pt6]}>
                <VokeIcon
                  name="speech-bubble-full"
                  style={[
                    hasUnread && !isSolo ? st.orange : isCompleted ? st.white : st.charcoal,
                  ]}
                />
                {hasUnread && !isSolo ? (
                  <Flex
                    align="center"
                    justify="center"
                    style={[st.circle(20), st.bgOrange, st.ml6]}
                  >
                    <Text style={[st.white]}>
                      {unreadCount > 99 ? '99' : unreadCount}
                    </Text>
                  </Flex>
                ) : null}
              </Flex>
            ) : null}
          </Flex>
          {isLocked ? null : (
            <Flex
              style={[
                st.absbr,
                st.isAndroid ? st.bottom(0) : st.bottom(5),
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
          )}
          <Flex
            style={[
              st.absbr,
              st.isAndroid ? st.bottom(-23) : st.bottom(-28),
              st.mh5,
            ]}
          >
            <Text style={[isWaiting ? st.orange : st.blue, st.fs(72)]}>
              {step.position}
            </Text>
          </Flex>
        </Flex>
        {isWaiting && messengers.length > 2 ? (
          <Flex
            align="center"
            style={[st.bgOrange, st.w100, st.pd6, st.brbl5, st.brbr5]}
          >
            <Text style={[st.fs4]}>waiting for answer</Text>
          </Flex>
        ) : null}
        {isCompleted ? (
          <Flex
            style={[
              st.abs,
              st.top(-15),
              st.right(-15),
              st.bgDarkerBlue,
              st.pd6,
              st.br2,
            ]}
          >
            <VokeIcon type="image" name="check" size={16} style={[]} />
          </Flex>
        ) : null}
      </Flex>
    </Touchable>
  );
}

export default AdventureStepCard;
