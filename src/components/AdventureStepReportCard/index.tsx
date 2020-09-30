import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { RootState } from '../../reducers';
import Image from '../Image';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import st from '../../st';
import styles from './styles';
import { TAdventureSingle, TStep } from '../../types';
import {
  getCurrentUserId,
} from '../../utils/get';

type StepReportProps = {
  status: string;
  // eslint-disable-next-line camelcase
  unread_messages: number;
  'completed_by_messenger?': boolean;
};

type AdventureStepReportCardProps = {
  stepId: string;
  adventureId: string;
  // step?: TStep;
  steps?: StepProps[];
  adventure?: TAdventureSingle;
};

// Renders Cards on this screen https://d.pr/i/WsCCf2
function AdventureStepReportCard({
  stepId,
  adventureId,
  // step,
  // steps,
  // adventure,
}: AdventureStepReportCardProps): React.ReactElement {
  const { t } = useTranslation('journey');
  const navigation = useNavigation();
  const userId = getCurrentUserId();
  const adventure = useSelector(({ data }: RootState) => data.myAdventures.byId[adventureId]);
  const step = useSelector(({ data }: RootState) => data.adventureSteps[adventureId].byId[stepId]);

  // Monitor any changes in steps and step parammeters of the component
  // to update the card elements accordingly.
  // For example we need to update unread count on the card when state changed.
  useEffect(() => {

  }, [step]);


  return (
    <Flex style={styles.StepWrapper}>
    <Touchable
      highlight={false}
      activeOpacity={0.8}
      // onPress={(): void =>
      //   navigation.navigate('AdventureStepScreen', {
      //     stepId: step.id,
      //     adventureId: adventure.id,
      //   })
      // }
      style={[styles.StepCard]}
    >
      <Flex
        style={[
          st.bgWhite,
          st.br5,
        ]}
        align="center"
        justify="start"
        // direction="row"
      >
        <Flex direction="row" style={[st.maxh(70)]} >
          <Flex value={1} direction="column" self="start" style={[styles.Content]}>
            <Text
              numberOfLines={2}
              style={[st.fs4, st.darkBlue]}
            >
              {step.name}
            </Text>
            <Text style={[st.fs5, st.darkBlue]}>
              {t('part')} {step.position}
            </Text>
          </Flex>
          <Flex>

          </Flex>
        </Flex>
      </Flex>
    </Touchable>
    </Flex>
  );
}

export default AdventureStepReportCard;
