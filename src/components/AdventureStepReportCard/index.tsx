import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { ScrollView } from 'react-native-gesture-handler';

import { RootState } from '../../reducers';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import theme from '../../theme';
import OldButton from '../OldButton';
import {
  getMyAdventure,
  getAdventureSteps,
  unlockNextAdventureStep,
} from '../../actions/requests';
import Image from '../Image';

import styles from './styles';

type StepReportProps = {
  status: string;
  // eslint-disable-next-line camelcase
  unread_messages: number;
  'completed_by_messenger?': boolean;
};

type Props = {
  step: any;
  adventureId: string;
  activeStepRef?: any;
  // steps?: StepProps[];
  // adventure?: TAdventureSingle;
};

function AdventureStepReportCard({
  stepId,
  adventureId,
  activeStepRef,
}: // step,
// steps,
// adventure,
Props): React.ReactElement {
  const dispatch = useDispatch();
  const [isNext, setIsNext] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const modalizeRef = useRef<Modalize>(null);
  const { t } = useTranslation('manageGroup');
  const { height } = Dimensions.get('window');
  const adventure = useSelector(
    ({ data }: RootState) => data.myAdventures.byId[adventureId],
  );
  const step = useSelector(
    ({ data }: RootState) =>
      data.adventureSteps[adventureId]?.byId[stepId] || {},
  );
  console.log('🦀 adventure:', adventure, adventure?.progress?.total);
  console.log('🦒 step:', step);
 /*  const step = useSelector(
    ({ data }: RootState) =>
      data.adventureSteps[adventureId].byId[step.id] || {},
  ); */

  if (stepId === 'graduated') {
    step.id = 'graduated';
    step.name = 'Graduated Users';
    step.active_messengers = [];
  }

  // console.log('🦕 step:', step);

  useEffect(() => {
    setIsManual(!adventure?.gating_period);
  }, [adventure?.gating_period]);

  const updateNextStep = () => {
    // if (isManual && step.status === 'inactive') {
    if (isManual && step?.locked) {
      if (!activeStepRef.current) {
        activeStepRef.current = step.position;
      }

      if (activeStepRef.current === step.position) {
        setIsNext(true);
      }

      if (activeStepRef.current > step.position && isNext) {
        setIsNext(false);
      }
    }
  };

  // Monitor any changes in steps and step parammeters of the component
  // to update the card elements accordingly.
  // For example we need to update unread count on the card when state changed.
  useEffect(() => {
    updateNextStep();
  }, [isManual]);

  useEffect(() => {
    updateNextStep();
  }, [activeStepRef.current]);

  const unlockNextStep = async adventureId => {
    const results = await dispatch(unlockNextAdventureStep(adventureId));
    // TODO: when we have results refetch adventure to have UI updated.
    setTimeout(() => {
      activeStepRef.current = activeStepRef.current + 1;
      dispatch(getAdventureSteps(adventureId));
      dispatch(getMyAdventure(adventureId));
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={(): void => {}}
        style={
          styles[
            // step.locked || (step.status === 'inactive' && !isNext)
            step.locked
              ? 'cardLocked'
              : isNext
              ? 'cardNext'
              : step.id === 'graduated'
              ? 'cardGraduated'
              : 'card'
          ]
        }
      >
        <Flex align="center" justify="start">
          <Flex value={1} direction="row" self="start">
            <View style={styles.cardContent}>
              <Text
                numberOfLines={2}
                style={
                  step.id === 'graduated'
                    ? styles.cardGraduatedTitle
                    : styles.cardTitle
                }
              >
                {step.name}
              </Text>
              {!!step.position && (
                <Text style={styles.cardSubTitle}>
                  {t('part')} {step.position}
                </Text>
              )}
            </View>
            <View style={styles.action}>
              {isNext ? (
                <OldButton
                  onPress={() => unlockNextStep(adventure.id)}
                  style={styles.actionReleaseNow}
                >
                  <Text style={styles.actionReleaseNowLabel}>
                    {t('releaseNow')}
                  </Text>
                </OldButton>
              ) : // ) : step.locked || step.status === 'inactive' ? (
              step.locked ? (
                <VokeIcon name={'lock'} size={20} style={styles.actionLocked} />
              ) : (
                <Text
                  style={
                    step.id === 'graduated'
                      ? styles.actionGraduatedText
                      : styles.actionText
                  }
                  onPress={() => modalizeRef.current?.open()}
                >
                  {t('seeAllMembers') +
                    ' (' +
                    step.active_messengers.length +
                    ')'}
                </Text>
              )}
            </View>
          </Flex>
        </Flex>
      </Touchable>
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalTopOffset={height / 2}
          handlePosition={'inside'}
          openAnimationConfig={{
            timing: { duration: 300 },
          }}
          onClose={() => {}}
          modalStyle={{
            backgroundColor: theme.colors.white,
          }}
        >
          <SafeAreaView edges={['bottom']}>
            <View style={styles.stepMembers}>
              <View style={styles.stepMembersHeader}>
                <Text numberOfLines={2} style={styles.modalTitle}>
                  {step.name}
                </Text>
                {!!step.position && (
                  <Text style={styles.modalSubTitle}>
                    {t('part')} {step.position}
                  </Text>
                )}
              </View>
              <ScrollView
                style={{
                  height: '100%',
                }}
              >
                <FlatList
                  data={step.active_messengers}
                  renderItem={({ item }): React.ReactElement => (
                    <View style={styles.stepMemberItem}>
                      <Image
                        resizeMode="contain"
                        source={{ uri: item.avatar.medium }}
                        style={styles.avatar}
                      />
                      <Text style={styles.stepMemberItemText}>
                        {item.first_name} {item.last_name}
                      </Text>
                    </View>
                  )}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modalize>
      </Portal>
    </View>
  );
}

export default AdventureStepReportCard;
