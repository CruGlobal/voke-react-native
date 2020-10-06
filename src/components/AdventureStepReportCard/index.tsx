import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { ScrollView } from 'react-native-gesture-handler';

import { RootState } from '../../reducers';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Text from '../Text';
import { TAdventureSingle, TStep } from '../../types';
import { getCurrentUserId } from '../../utils/get';
import VokeIcon from '../VokeIcon';
import theme from '../../theme';

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
  // step?: TStep;
  // steps?: StepProps[];
  // adventure?: TAdventureSingle;
};

function AdventureStepReportCard({
  stepId,
  adventureId,
}: // step,
// steps,
// adventure,
Props): React.ReactElement {
  const modalizeRef = useRef<Modalize>(null);
  const { t } = useTranslation('manageGroup');
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();
  const userId = getCurrentUserId();
  const adventure = useSelector(
    ({ data }: RootState) => data.myAdventures.byId[adventureId],
  );
  const step = useSelector(
    ({ data }: RootState) => data.adventureSteps[adventureId].byId[stepId],
  );

  // Monitor any changes in steps and step parammeters of the component
  // to update the card elements accordingly.
  // For example we need to update unread count on the card when state changed.
  /* useEffect(() => {

  }, [step]);
 */

  return (
    <View style={styles.container}>
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        // onPress={(): void =>
        //   navigation.navigate('AdventureStepScreen', {
        //     stepId: step.id,
        //     adventureId: adventure.id,
        //   })
        // }
        // style={[styles.card]}
        style={styles[step.locked ? 'cardLocked' : 'card']}
      >
        <Flex
          align="center"
          justify="start"
          // direction="row"
        >
          <Flex value={1} direction="row" self="start">
            <View style={styles.cardContent}>
              <Text numberOfLines={2} style={styles.cardTitle}>
                {step.name}
              </Text>
              <Text style={styles.cardSubTitle}>
                {t('part')} {step.position} -{' '}
                {step.locked ? 'LOCKED' : 'UNLOCKED'}
              </Text>
            </View>
            <View style={styles.action}>
              {step.locked ? (
                <VokeIcon name={'lock'} size={30} style={styles.actionLocked} />
              ) : (
                <Text
                  style={styles.actionText}
                  onPress={() => modalizeRef.current?.open()}
                >
                  {t('seeAllMembers')}
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
          onClose={() => {
            // modalizeRef.current?.close()
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
                <Text style={styles.modalSubTitle}>
                  {t('part')} {step.position} -{' '}
                  {step.locked ? 'LOCKED' : 'UNLOCKED'}
                </Text>
              </View>
              <ScrollView style={{
                backgroundColor: 'red',
                height: '100%'
              }}>
                <View style={styles.stepMemberItem}>
                  <Text style={styles.stepMemberItemText}>Jessica Smith</Text>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modalize>
      </Portal>
    </View>
  );
}

export default AdventureStepReportCard;
