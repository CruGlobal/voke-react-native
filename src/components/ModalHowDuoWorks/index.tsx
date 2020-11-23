import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-scalable-image';
import ChatExample from 'src/assets/ChatExample.png';
import VideoExample from 'src/assets/VideoExample.png';
import InviteCodeExample from 'src/assets/InviteCodeExample2.png';

import Flex from '../Flex';
import Text from '../Text';
import theme from 'utils/theme';
import OldButton from '../OldButton';
import BotTalking from '../BotTalking';

import styles from './styles';

// Renders Cards on this screen https://d.pr/i/WsCCf2
function ModalHowDuoWorks({ primaryAction }): React.ReactElement {
  const { t } = useTranslation('modal');

  return (
    <ScrollView bounces={false} scrollIndicatorInsets={{ right: 1 }}>
      <SafeAreaView>
        <Flex style={styles.container} direction="column" align="center">
          <View style={{ minHeight: theme.spacing.xl }} />
          <BotTalking type="overlay" heading={t('howDuoWorksBotTitle')}>
            {t('howDuoWorksBotBody')}
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
            <Text style={styles.stepsTitle}>{t('howDuoWorksTitle')}</Text>
            <View style={{ minHeight: theme.spacing.l }} />
            <>
              {/* DUO */}
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
                <Text style={styles.stepText}>{t('howDuoWorksChat')}</Text>
                <Image width={130} source={ChatExample} />
              </Flex>
              <Flex
                direction="row"
                align="center"
                justify="center"
                style={{ marginTop: theme.spacing.l }}
              >
                <Image width={130} source={InviteCodeExample} />
                <Text style={styles.stepText}>{t('howDuoWorksShare')}</Text>
              </Flex>
            </>
            <View style={{ minHeight: theme.spacing.l }} />
            <Text style={styles.startText}>{t('howDuoWorksStart')}</Text>
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

export default ModalHowDuoWorks;
