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
import ModalSharingCode from '../../assets/ModalSharingCode.png';
import ModalSharingLink from '../../assets/ModalSharingLink.png';
import ModalSharingNotification from '../../assets/ModalSharingNotification.png';
import ModalSharingPersonalize from '../../assets/ModalSharingPersonalize.png';

import styles from './styles';

// Renders Cards on this screen https://d.pr/i/WsCCf2
function ModalHowGroupsWork({ primaryAction }): React.ReactElement {
  const { t } = useTranslation('modal');

  return (
    <ScrollView bounces={false}>
      <SafeAreaView>
        <Flex
          style={styles.container}
          direction="column"
          align="center"
        >
          <View style={{ minHeight: theme.spacing.xl }} />
          <BotTalking type="overlay" heading={t('howGroupsWorkBotTitle')}>
            {t('howGroupsWorkBotBody')}
          </BotTalking>
          <Flex value={1} style={{ marginTop: -15 }}>
            <OldButton
              isAndroidOpacity={true}
              style={styles.buttonAction}
              onPress={primaryAction}
            >
              <Flex direction="row" align="center" justify="center">
                <Text style={styles.buttonActionLabel}>{t('getStarted')}</Text>
              </Flex>
            </OldButton>
          </Flex>
          <View style={{ minHeight: theme.spacing.xl }} />
          <Flex align="center" justify="center">
            <Text style={styles.stepsTitle}>{t('howGroupsWorkTitle')}</Text>
            <View style={{ minHeight: theme.spacing.l }} />
            <>
              {/* GROUP */}
              <Flex
                direction="row"
                align="center"
                justify="center"
                style={{ marginTop: theme.spacing.l }}
              >
                <Image width={130} source={VideoExample} />
                <Text style={styles.stepText}>{t('howItWorksWatch')}</Text>
              </Flex>
              <Flex
                direction="row"
                align="center"
                justify="center"
                style={{ marginTop: theme.spacing.l }}
              >
                <Text style={styles.stepText}>{t('howGroupsWorkChat')}</Text>
                <Image width={130} source={ChatExample} />
              </Flex>
              <Flex
                direction="row"
                align="center"
                justify="center"
                style={{ marginTop: theme.spacing.l }}
              >
                <Image width={130} source={GroupWelcomeExample} />
                <Text style={styles.stepText}>{t('howGroupsWorkLimit')}</Text>
              </Flex>
              <Flex
                direction="row"
                align="center"
                justify="center"
                style={{ marginTop: theme.spacing.l }}
              >
                <Text style={styles.stepText}>{t('howGroupsWorkShare')}</Text>
                <Image width={130} source={InviteCodeExample} />
              </Flex>
            </>
            <View style={{ minHeight: theme.spacing.l }} />
            <Text style={styles.startText}>{t('howGroupsWorkStart')}</Text>
            <View style={{ minHeight: theme.spacing.l }} />
            <Flex>
              <OldButton
                isAndroidOpacity={true}
                style={styles.buttonAction}
                onPress={primaryAction}
              >
                <Flex direction="row" align="center" justify="center">
                  <Text style={styles.buttonActionLabel}>
                    {t('getStarted')}
                  </Text>
                </Flex>
              </OldButton>
              <View style={{ minHeight: theme.spacing.xxl }} />
            </Flex>
          </Flex>
        </Flex>
      </SafeAreaView>
    </ScrollView>
  );
}

export default ModalHowGroupsWork;
