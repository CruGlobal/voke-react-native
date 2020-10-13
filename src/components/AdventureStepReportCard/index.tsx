import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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
import { TAdventureSingle, TStep } from '../../types';
import { getCurrentUserId } from '../../utils/get';
import VokeIcon from '../VokeIcon';
import theme from '../../theme';
import Button from '../Button';
import { getAdventureSummary } from '../../actions/requests';

import styles from './styles';
import Image from '../Image';

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
  step,
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
  const stepInfo = useSelector(
    ({ data }: RootState) => data.adventureSteps[adventureId].byId[step.id],
  );

  useEffect(() => {
    setIsManual(!adventure.gating_period);
  }, [adventure?.gating_period]);

  // Monitor any changes in steps and step parammeters of the component
  // to update the card elements accordingly.
  // For example we need to update unread count on the card when state changed.
  useEffect(() => {
    if (isManual && stepInfo.status === 'inactive' && !activeStepRef.current) {
      activeStepRef.current = stepInfo.position;
      setIsNext(true);
    }
  }, [isManual]);

  return (
    <View style={styles.container}>
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={(): void => {}}
        style={
          styles[
            stepInfo.locked || (stepInfo.status === 'inactive' && !isNext)
              ? 'cardLocked'
              : isNext
              ? 'cardNext'
              : 'card'
          ]
        }
      >
        <Flex align="center" justify="start">
          <Flex value={1} direction="row" self="start">
            <View style={styles.cardContent}>
              <Text numberOfLines={2} style={styles.cardTitle}>
                {stepInfo.name}
              </Text>
              <Text style={styles.cardSubTitle}>
                {t('part')} {stepInfo.position}
              </Text>
            </View>
            <View style={styles.action}>
              {isNext ? (
                <Button onPress={() => {}} style={styles.actionReleaseNow}>
                  <Text style={styles.actionReleaseNowLabel}>
                    {t('releaseNow')}
                  </Text>
                </Button>
              ) : stepInfo.locked || stepInfo.status === 'inactive' ? (
                <VokeIcon name={'lock'} size={20} style={styles.actionLocked} />
              ) : (
                <Text
                  style={styles.actionText}
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
                  {stepInfo.name}
                </Text>
                <Text style={styles.modalSubTitle}>
                  {t('part')} {stepInfo.position}
                </Text>
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
