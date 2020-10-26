import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-scalable-image';

import Flex from '../Flex';
import Text from '../Text';
import st from '../../st';
import theme from '../../theme';
import OldButton from '../OldButton';
import BotTalking from '../BotTalking';
import ChatExample from '../../assets/ChatExample.png';
import VideoExample from '../../assets/VideoExample.png';
import InviteCodeExample from '../../assets/InviteCodeExample2.png';
import GroupWelcomeExample from '../../assets/GroupWelcomeExample.png';
import howItWorksAddMembers from '../../assets/howItWorksAddMembers.png';
import howItWorksReleaseType from '../../assets/howItWorksReleaseType.png';
import Screen from '../Screen';

import styles from './styles';

// Renders Cards on this screen https://d.pr/i/WsCCf2
function ModalHowGroupsWork({ primaryAction }): React.ReactElement {
  const { t } = useTranslation('modal');

  return (
    <Screen background={'transparent'} testID="groupTutorial">
      {/* <Flex style={styles.container} direction="column" align="center"> */}
      <View style={{ minHeight: theme.spacing.xl }} />
      <BotTalking type="overlay" heading={t('howGroupsWorkBotTitle')}>
        {t('howGroupsWorkBotBody')}
      </BotTalking>
      <Flex value={1} style={{ marginTop: -15 }} align="center">
        <OldButton
          isAndroidOpacity={true}
          style={styles.buttonAction}
          onPress={primaryAction}
          testID="ctaGetStartedGroup"
        >
          <Flex direction="row" align="center" justify="center">
            <Text style={styles.buttonActionLabel}>{t('getStarted')}</Text>
          </Flex>
        </OldButton>
      </Flex>
      <View style={{ minHeight: theme.spacing.xl }} />
      <Flex align="center">
        <Text style={styles.stepsTitle}>{t('howGroupsWorkTitle')}</Text>
      </Flex>
      <View style={{ minHeight: theme.spacing.l }} />
      <>
        {/* ========================================================== */}
        <Flex
          direction="row"
          align="center"
          style={{ marginTop: theme.spacing.l }}
        >
          <Flex align="start" style={{...styles.stepImage, paddingRight: theme.spacing.l}}>
            <Image
              width={130}
              source={howItWorksReleaseType}
              style={styles.deviceImage}
            />
          </Flex>
          <Text style={styles.stepText}>{t('howItWorksReleaseType')}</Text>
        </Flex>
        <Flex
          direction="row"
          align="center"
          style={{
            marginTop: theme.spacing.l,
          }}
        >
          <Text style={styles.stepText}>{t('howItWorksAddMembers')}</Text>
          <Flex align="end" style={{...styles.stepImage, paddingLeft: theme.spacing.l}}>
            <Image
              width={130}
              source={howItWorksAddMembers}
              style={styles.deviceImage}
            />
          </Flex>
        </Flex>
        <Flex
          direction="row"
          align="center"
          style={{
            marginTop: theme.spacing.l,
          }}
        >
          <Flex align="start" style={{...styles.stepImage, paddingRight: theme.spacing.l}}>
            <Image
              width={130}
              source={VideoExample}
              style={styles.deviceImage}
            />
          </Flex>
          <Text style={styles.stepText}>{t('howItWorksWatch')}</Text>
        </Flex>
        <Flex
          direction="row"
          align="center"
          style={{
            marginTop: theme.spacing.l,
          }}
        >
          <Text style={styles.stepText}>{t('howGroupsWorkChat')}</Text>
          <Flex align="end" style={{...styles.stepImage, paddingLeft: theme.spacing.l}}>
            <Image
              width={130}
              source={ChatExample}
              style={styles.deviceImage}
            />
          </Flex>
        </Flex>
        <Flex
          direction="row"
          align="center"
          style={{
            marginTop: theme.spacing.l,
          }}
        >
          <Flex align="start" style={{...styles.stepImage, paddingRight: theme.spacing.l}}>
            <Image
              width={130}
              source={GroupWelcomeExample}
              style={styles.deviceImage}
            />
          </Flex>
          <Text style={styles.stepText}>{t('howGroupsWorkLimit')}</Text>
        </Flex>
        <Flex
          direction="row"
          align="center"
          style={{
            marginTop: theme.spacing.l,
          }}
        >
          <Text style={styles.stepText}>{t('howGroupsWorkShare')}</Text>
          <Flex align="end" style={{...styles.stepImage, paddingLeft: theme.spacing.l}}>
            <Image
              width={130}
              source={InviteCodeExample}
              style={styles.deviceImage}
            />
          </Flex>
        </Flex>
      </>
      <View style={{ minHeight: theme.spacing.l }} />
      <Text style={styles.startText}>{t('howGroupsWorkStart')}</Text>
      <View style={{ minHeight: theme.spacing.l }} />

      <Flex align="center">
        <OldButton
          isAndroidOpacity={true}
          style={styles.buttonAction}
          onPress={primaryAction}
          testID="ctaGetStartedGroupBottom"
        >
          <Flex direction="row" align="center" justify="center">
            <Text style={styles.buttonActionLabel}>{t('getStarted')}</Text>
          </Flex>
        </OldButton>
        <View style={{ minHeight: theme.spacing.xxl }} />
      </Flex>
      {/* </Flex> */}
    </Screen>
  );
}

export default ModalHowGroupsWork;
