/**
 * Modal informing the user that he was reported and blocked out of Voke.
 * We show this modal when getting WS message with action: 'block'.
 */
import React from 'react';
import { Linking, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMount, lockToPortrait } from 'utils';
import { RootState } from 'reducers';
import { avatars } from 'assets';
import BotTalking from 'components/BotTalking';
import CONSTANTS from 'utils/constants';
import Screen from 'components/Screen';
import Image from 'components/Image';
import Text from 'components/Text';

import styles from './styles';

const ReportedComment = (): React.ReactElement => {
  const avatar = useSelector(({ auth }: RootState) => auth.user.avatar?.small);
  const firstName =
    useSelector(({ auth }: RootState) => auth.user.firstName) || '';
  const lastName =
    useSelector(({ auth }: RootState) => auth.user.lastName) || '';
  const reportedMessage =
    useSelector(({ auth }: RootState) => auth.userBlocked.reportedMessage) ||
    '';
  const blockReason =
    useSelector(({ auth }: RootState) => auth.userBlocked.blockReason) || '';

  return (
    <View style={styles.reportedComment}>
      <View style={styles.reportedCommentMain}>
        <View style={styles.reportedUser}>
          <Image
            source={avatar ? { uri: avatar } : avatars.default}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{`  ${firstName} ${lastName}`}</Text>
        </View>
        <Text style={styles.reportedMessage}>“{reportedMessage}”</Text>
      </View>
      <View style={styles.reportedCommentReason}>
        <Text style={styles.reportedCommentReasonText}>{blockReason}</Text>
      </View>
    </View>
  );
};

const AccountBlocked = (): React.ReactElement => {
  const { t } = useTranslation('modal');
  const groupName =
    useSelector(({ auth }: RootState) => auth.userBlocked.groupName) || '';

  useMount(() => {
    lockToPortrait(); // TODO: move this into the <Screen> component?
  });

  const linkTOS = () => (
    <Text
      onPress={(): Promise<void> => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
      style={styles.link}
    >
      {t('tos')}
    </Text>
  );

  return (
    <Screen>
      <BotTalking
        heading={t('removedFromVokeTitle')}
        style={styles.botMessageBlock}
        type="sad"
      />
      <Text style={styles.textReason}>
        {t('removedFromVokeBody') + ' '}
        {linkTOS()}
        {'. \n' + t('removedFromVokeWhatWrong')}
      </Text>
      <ReportedComment />
      <Text style={styles.textConclusion}>
        {t('modal:removedFromVokeContactLeader', {
          groupName: groupName,
        })}
      </Text>
    </Screen>
  );
};

export default AccountBlocked;
