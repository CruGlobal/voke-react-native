import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { ScrollView } from 'react-native-gesture-handler';
import theme from 'utils/theme';

import { RootState } from '../../reducers';
import Flex from '../Flex';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import OldButton from '../OldButton';
import { unlockNextAdventureStep } from '../../actions/requests';
import Image from '../Image';

import styles from './styles';

type StepReportProps = {
  status: string;
  // eslint-disable-next-line camelcase
  unread_messages: number;
  'completed_by_messenger?': boolean;
};

type Props = {
  stepId: string;
  adventureId: string;
  currentStep: number;
  setCurrentStep: (newVal: number) => void;
};

function AdventureStepReportCard({
  stepId,
  adventureId,
  currentStep,
  setCurrentStep,
}: Props): React.ReactElement {
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

  const stepLocked = useSelector(
    ({ data }: RootState) =>
      data.adventureSteps[adventureId]?.byId[stepId]?.locked || false,
  );

  /*  const step = useSelector(
    ({ data }: RootState) =>
      data.adventureSteps[adventureId].byId[step.id] || {},
  ); */

  if (stepId === 'graduated' && adventure?.id) {
    const allUsers = adventure?.conversation?.messengers;
    const garduatedUsers = allUsers.filter(user => user.completed);
    step.id = 'graduated';
    step.name = 'Graduated Users';
    step.active_messengers = garduatedUsers;
    step.position = '99'; // position required for testID!
  }

  useEffect(() => {
    setIsManual(!adventure?.gating_period);
  }, [adventure?.gating_period]);

  const updateNextStep = () => {
    // if (isManual && step.status === 'inactive') {
    const position = parseInt(step.position, 10);
    if (!stepLocked && position !== 99) {
      if (currentStep > 0 && currentStep < position) {
        setCurrentStep(() => position);
      } else if (currentStep === 0 && position === 1) {
        setCurrentStep(() => position);
      }
    }

    if (currentStep + 1 === position) {
      setIsNext(true);
    } else if (isNext) {
      setIsNext(false);
    }
  };

  // Monitor any changes in steps and step parammeters of the component
  // to update the card elements accordingly.
  // For example we need to update unread count on the card when state changed.
  useEffect(() => {
    updateNextStep();
  }, [currentStep, stepLocked, isManual]);

  const unlockNextStep = async adventureId => {
    const results = await dispatch(unlockNextAdventureStep(adventureId));
    if (results?.id) {
      // TODO: when we have results refetch adventure to have UI updated.
      setCurrentStep(curVal => curVal + 1);
      step.locked = false;
      setIsNext(false);
      // setTimeout(() => {
      // Don't do that. We are getting WebSocket with unlock action.
      // dispatch(getAdventureSteps(adventureId));
      // dispatch(getMyAdventure(adventureId));
      // }, 1000);
    }
  };

  const stepStyle = (): string => {
    let styleClass = '';
    if (step.id === 'graduated') {
      styleClass = 'cardGraduated';
    } else if (step.locked) {
      if (isNext) {
        styleClass = 'cardNext';
      } else {
        styleClass = 'cardLocked';
      }
    } else {
      styleClass = 'card';
    }
    return styleClass;
  };

  if (
    !adventure?.id ||
    (stepId === 'graduated' && !step.active_messengers.length)
  ) {
    return <></>;
  } else {
    return (
      <View style={styles.container}>
        <View
          style={
            styles[
              // step.locked || (step.status === 'inactive' && !isNext)
              stepStyle()
            ]
          }
          testID={step?.position ? 'stepPart-' + step.position : ''}
          testID={
            step.locked
              ? 'lockedStepPart-' + step.position
              : 'availableStepPart-' + step.position
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
                {!!step.position && stepId !== 'graduated' && (
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
                    testID="ctaReleaseNow"
                  >
                    <Text style={styles.actionReleaseNowLabel}>
                      {t('releaseNow')}
                    </Text>
                  </OldButton>
                ) : // ) : step.locked || step.status === 'inactive' ? (
                step.locked ? (
                  <VokeIcon
                    name={'lock'}
                    size={20}
                    style={styles.actionLocked}
                    testID={step?.position ? 'lockedPart-' + step.position : ''}
                  />
                ) : (
                  <Text
                    style={
                      step.id === 'graduated'
                        ? styles.actionGraduatedText
                        : styles.actionText
                    }
                    onPress={() => {
                      step.active_messengers.length > 0
                        ? modalizeRef.current?.open()
                        : false;
                    }}
                    testID={
                      step?.position ? 'allMembersPart-' + step.position : ''
                    }
                  >
                    {step.active_messengers.length > 0
                      ? t('seeAllMembers') +
                        ' (' +
                        step.active_messengers.length +
                        ')'
                      : ' '}
                  </Text>
                )}
              </View>
            </Flex>
          </Flex>
        </View>
        <Portal>
          <Modalize
            ref={modalizeRef}
            modalTopOffset={height / 2}
            handlePosition={'inside'}
            openAnimationConfig={{
              timing: { duration: 300 },
            }}
            onClose={() => {}}
            rootStyle={{
              elevation: 5, // need it here to solve issue with button shadow.
            }}
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
                  {!!step.position && stepId !== 'graduated' && (
                    <Text style={styles.modalSubTitle}>
                      {t('part')} {step.position}
                    </Text>
                  )}
                </View>
                <ScrollView
                  style={{
                    height: '100%',
                  }}
                  scrollIndicatorInsets={{ right: 1 }}
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
}

export default AdventureStepReportCard;
