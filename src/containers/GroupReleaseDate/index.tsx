/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import {
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Image from 'react-native-scalable-image';

import manualReleaseExample from '../../assets/manualReleaseExample.png';
import Touchable from '../../components/Touchable';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import Dropdown from '../../components/Dropdown';
import Datepicker from '../../components/Datepicker';
import Button from '../../components/Button';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import { toastAction } from '../../actions/info';
import { sendAdventureInvitation } from '../../actions/requests';

import styles from './styles';

const GroupReleaseDate = (props): React.ReactElement => {
  const { t } = useTranslation('share');
  const { groupName, itemId, releaseSchedule } = props?.route?.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Hooks:
  const [weekday, setWeekday] = useState(moment().format('dddd'));
  const [time, setTime] = useState(
    moment().add(1, 'hours').minute(0).format('h:mm A'),
  );
  const [date, setDate] = useState();
  const [gatingPeriod, setGatingPeriod] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (releaseSchedule === 'weekly') {
      navigation.setOptions({ title: t('title:groupWeekly') });
      setGatingPeriod(7);
    } else if (releaseSchedule === 'daily') {
      navigation.setOptions({ title: t('title:groupDaily') });
      setGatingPeriod(1);
    } else if (releaseSchedule === 'manual') {
      navigation.setOptions({ title: t('title:groupManual') });
    }
  }, []);

  useEffect(() => {
    const newTimeRaw = moment(
      moment().format('DD MM YYYY') + ' ' + time,
      'DD MM YYYY h:mm a',
    );
    let newDate = moment()
      .day(weekday)
      .hour(newTimeRaw.hour())
      .minute(newTimeRaw.minute())
      .second(12);
    const now = moment();
    const diff = now.diff(newDate);
    // - if date in the future diff < 0
    // - if date in the past diff > 0
    if (diff > 0) {
      // Set the next week new date is already in the past.
      newDate = newDate.add(1, 'weeks');
    }
    setDate(newDate);
  }, [weekday, time]);

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);

      const result = await dispatch(
        sendAdventureInvitation({
          // eslint-disable-next-line camelcase
          organization_journey_id: itemId,
          name: groupName,
          kind: 'multiple',
          // eslint-disable-next-line camelcase
          gating_period: gatingPeriod,
          // Total of days between every step (default 0)
          // - if you want it to be daily it should be: 1;
          // - if you want it to be weekly it should be: 7
          // eslint-disable-next-line camelcase
          gating_start_at: moment(date).utc().format(),
          // defines when the journey should start,
          // and all of the operations are going to be over this period;
          // you have to send a datetime on this field
          // and it should be on UTC
        }),
      );
      setIsLoading(false);

      if (result?.id) {
        navigation.navigate('AdventureShareCode', {
          invitation: result,
          withGroup: true,
          isVideoInvite: false,
        });
      } else {
        Alert.alert('Failed to create a valid invite.', 'Please try again.');
      }
    } catch (e) {
      setIsLoading(false);
      if (e?.message === 'Network request failed') {
        Alert.alert(e?.message, t('checkInternet'));
      } else if (e?.message) {
        Alert.alert(e?.message);
      } else {
        console.error(e);
      }
    }
  };

  const copyToClipboard = (value: string): void => {
    Clipboard.setString(value);
    dispatch(toastAction(t('copied'), 'short'));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      {/* <StatusBar /> <- TODO: Not sure why we need it here? */}
      {/* Makes possible to hide keyboard when tapping outside. */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollView}
      >
        <DismissKeyboardView style={{ flex: 1 }}>
          <Flex style={styles.screen}>
            <View style={styles.container}>
              {releaseSchedule === 'weekly' && (
                <Dropdown
                  label={t('releaseDay')}
                  items={[
                    { label: t('monday'), value: 'Monday' },
                    { label: t('tuesday'), value: 'Tuesday' },
                    { label: t('wednesday'), value: 'Wednesday' },
                    { label: t('thursday'), value: 'Thursday' },
                    { label: t('friday'), value: 'Friday' },
                    { label: t('saturday'), value: 'Saturday' },
                    { label: t('sunday'), value: 'Sunday' },
                  ]}
                  onChange={(newDay: string): void => {
                    setWeekday(newDay);
                  }}
                  initialValue={weekday}
                />
              )}
              {releaseSchedule !== 'manual' && (
                <>
                  <Datepicker
                    label={t('releaseTime')}
                    format={'h:mm A'}
                    initialDate={time}
                    mode="time"
                    minuteInterval={5}
                    onChange={(newTime: string): void => {
                      setTime(newTime);
                    }}
                  />
                  <Text style={styles.textResult}>
                    {t('videoUnlockSchedule') +
                      ' ' +
                      t(
                        releaseSchedule === 'weekly' ? 'everyWeek' : 'everyDay',
                      )}
                  </Text>
                  {releaseSchedule === 'weekly' && (
                    <Touchable
                      onPress={(): void =>
                        copyToClipboard(moment(date).format('LLL'))
                      }
                    >
                      <Text style={styles.releaseDate}>
                        {moment(date).format(' dddd, LT')}
                      </Text>
                    </Touchable>
                  )}
                  <Text style={styles.releaseDue}>
                    {'( ' + t('firstRelease') + ' ' + moment().to(date) + ' )'}
                  </Text>
                </>
              )}
              {releaseSchedule === 'manual' && (
                <>
                  <Text style={styles.manual}>{t('groupReleaseManual')}</Text>
                  <Image
                    width={280}
                    source={manualReleaseExample}
                    style={styles.manualPicture}
                  />
                  <Text style={styles.manualSecondary}>
                    {t('groupReleaseManualReady')}
                  </Text>
                </>
              )}
              <Button
                onPress={handleContinue}
                touchableStyle={styles.button}
                isLoading={isLoading}
                testID={'ctaNameContinue'}
              >
                <Text style={styles.buttonLabel}>{t('continue')}</Text>
              </Button>
            </View>
          </Flex>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default GroupReleaseDate;
