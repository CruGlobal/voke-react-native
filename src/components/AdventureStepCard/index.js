import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Flex from '../Flex';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import Button from '../Button';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Renders Cards on this screen https://d.pr/i/WsCCf2
function AdventureStepCard({ item, adventure }) {
  item = item || {};
  adventure = adventure || {};
  const navigation = useNavigation();
  const me = useSelector(({ auth }) => auth.user);
  const steps = useSelector(({ data }) => data.adventureSteps);
  const [currentSteps, setCurrentSteps] = useState(steps[adventure.id] || []);
  const [currentStep, setCurrentStep] = useState(
    currentSteps.find(s => s.id === item.id),
  );

  const [isActive, setIsActive] = useState(currentStep.status === 'active');
  const [isCompleted, setIsCompleted] = useState(
    currentStep.status === 'completed',
  );
  const [isWaiting, setIsWaiting] = useState(
    isActive && currentStep['completed_by_messenger?'],
  );
  const [unreadCount, setUnreadCount] = useState(currentStep.unread_messages);
  const [isLocked, setIsLocked] = useState(!isCompleted && !isActive);
  const [hasUnread, setHasUnread] = useState(unreadCount > 0);
  useEffect(() => {
    const newSteps = steps[adventure.id];
    const newCurrentStep = newSteps.find(s => s.id === item.id);
    setCurrentSteps(newSteps);
    setCurrentStep(newCurrentStep);
    setIsActive(newCurrentStep.status === 'active');
    setIsCompleted(newCurrentStep.status === 'completed');
    setIsWaiting(
      newCurrentStep.status === 'active' &&
        newCurrentStep['completed_by_messenger?'],
    );
    setUnreadCount(newCurrentStep.unread_messages);
    setIsLocked(
      newCurrentStep.status !== 'completed' &&
        newCurrentStep.status !== 'active',
    );
    setHasUnread(newCurrentStep.unread_messages > 0);
  }, [steps]);

  const messengers = (adventure.conversation || {}).messengers || [];
  const thumbnail = (((currentStep.item || {}).content || {}).thumbnails || {})
    .small;
  let otherUser = messengers.find(
    i => i.id !== me.id && i.first_name !== 'VokeBot',
  );
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'multiple';

  // if (messengers.length === 2 && inviteName) {
  //   otherUser = { first_name: inviteName };
  // }

  return (
    <Touchable
      highlight={false}
      disabled={isLocked}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('AdventureStepScreen', {
          stepId: currentStep.id,
          adventure,
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
                name={isLocked ? 'lock' : 'play'}
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
              {currentStep.name}
            </Text>
            <Text style={[st.fs5, isActive ? st.darkBlue : st.white]}>
              {'Part'} {currentStep.position}
            </Text>
            {isActive || isCompleted ? (
              <Flex direction="row" align="center" style={[st.pt6]}>
                <VokeIcon
                  name="Chat"
                  style={[
                    hasUnread && !isSolo
                      ? st.orange
                      : isCompleted
                      ? st.white
                      : st.charcoal,
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
                isAndroidOpacity={true}
                onPress={() => {}}
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
              {currentStep.position}
            </Text>
          </Flex>
        </Flex>
        {isWaiting && messengers.length > 2 ? (
          <Flex
            align="center"
            style={[st.bgOrange, st.w100, st.pd6, st.brbl5, st.brbr5]}
          >
            <Text style={[st.fs4]}>'waiting for answer'</Text>
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
