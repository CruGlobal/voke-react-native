import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { tutorials } from 'assets';
import theme from 'utils/theme';
import Touchable from 'components/Touchable';
import Flex from 'components/Flex';
import Text from 'components/Text';

import OldButton from '../OldButton';
import BotTalking from '../BotTalking';
import Screen from '../Screen';

import styles from './styles';

type Props = {
  primaryAction?: () => void;
  onClose?: () => void;
};

function ModalHowGroupsWork({
  primaryAction,
  onClose,
}: Props): React.ReactElement {
  const { t } = useTranslation('modal');

  return (
    <Screen background={'transparent'} testID="groupTutorial">
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

      <Flex
        direction="row"
        align="center"
        style={{ marginTop: theme.spacing.l }}
      >
        <Flex
          align="start"
          style={{ ...styles.stepImage, paddingRight: theme.spacing.l }}
        >
          <Image
            width={130}
            source={tutorials.releaseType}
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
        <Flex
          align="end"
          style={{ ...styles.stepImage, paddingLeft: theme.spacing.l }}
        >
          <Image
            width={130}
            source={tutorials.addMembers}
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
        <Flex
          align="start"
          style={{ ...styles.stepImage, paddingRight: theme.spacing.l }}
        >
          <Image
            width={130}
            source={tutorials.video}
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
        <Flex
          align="end"
          style={{ ...styles.stepImage, paddingLeft: theme.spacing.l }}
        >
          <Image
            width={130}
            source={tutorials.chat}
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
        <Flex
          align="start"
          style={{ ...styles.stepImage, paddingRight: theme.spacing.l }}
        >
          <Image
            width={130}
            source={tutorials.group}
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
        <Flex
          align="end"
          style={{ ...styles.stepImage, paddingLeft: theme.spacing.l }}
        >
          <Image
            width={130}
            source={tutorials.invite}
            style={styles.deviceImage}
          />
        </Flex>
      </Flex>

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
    </Screen>
  );
}

export default ModalHowGroupsWork;
