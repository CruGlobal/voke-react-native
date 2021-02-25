import Select from 'domain/Common/Select';
import ReleaseDaySwitch from 'domain/Adventures/ReleaseDaySwitch';

import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Image from 'react-native-scalable-image';
import Touchable from 'components/Touchable';
import Datepicker from 'components/Datepicker';
import OldButton from 'components/OldButton';
import Text from 'components/Text';
import Screen from 'components/Screen';
import Spacer from 'components/Spacer';
import { tutorials } from 'assets';
import VokeIcon from 'components/VokeIcon';

import { toastAction } from '../../../actions/info';
import {
  sendAdventureInvitation,
  updateAdventure,
} from '../../../actions/requests';

import styles from './styles';

const GroupReleaseDate = (props): React.ReactElement => {
  const {
    groupName,
    itemId,
    releaseSchedule,
    editing,
    releaseDate,
    adventureId,
  } = props?.route?.params;
  const { t } = useTranslation('share');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Hooks:
  const [weekday, setWeekday] = useState(
    editing ? moment(releaseDate).format('dddd') : moment().format('dddd'),
  );
  const [time, setTime] = useState(
    editing
      ? moment(releaseDate).format('h:mm A')
      : moment().add(1, 'hours').minute(0).format('h:mm A'),
  );
  const [date, setDate] = useState(releaseDate);
  const [gatingPeriod, setGatingPeriod] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
      .second(0);
    const now = moment();
    const diff = now.diff(newDate);
    // - if date in the future diff < 0
    // - if date in the past diff > 0
    // if (diff > 0) {
    // Set the next week new date is already in the past.
    if (releaseSchedule === 'weekly') {
      newDate = newDate.add(1, 'weeks');
    } else {
      newDate = newDate.add(1, 'days');
    }
    // }
    setDate(newDate);
  }, [weekday, time]);

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      let result;
      if (editing) {
        result = await dispatch(
          updateAdventure({
            id: adventureId,
            gating_period: releaseSchedule === 'manual' ? 0 : gatingPeriod,
            gating_start_at:
              // releaseSchedule === 'manual' ? null : moment(date).utc().format(),
              moment(date).utc().format(),
          }),
        );
      } else {
        result = await dispatch(
          // TODO NOT CREATE EDIT ADVENTURE!
          sendAdventureInvitation({
            organization_journey_id: itemId,
            name: groupName,
            kind: 'multiple',
            gating_period: releaseSchedule === 'manual' ? 0 : gatingPeriod,
            // Total of days between every step (default 0)
            // - if you want it to be daily it should be: 1;
            // - if you want it to be weekly it should be: 7
            gating_start_at:
              // releaseSchedule === 'manual' ? null : moment(date).utc().format(),
              moment(date).utc().format(),
            // defines when the journey should start,
            // and all of the operations are going to be over this period;
            // you have to send a datetime on this field
            // and it should be on UTC
          }),
        );
      }

      setIsLoading(false);

      // Depending on what we are doing with the invite (update or create)
      // we are getting the Adventure id in the different places.
      if (result?.messenger_journey_id) {
        navigation.navigate('AdventureManage', {
          adventureId: result.messenger_journey_id,
        });
      } else if (result?.id) {
        navigation.navigate('AdventureManage', {
          adventureId: result.id,
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
    <Screen>
      <View style={styles.container}>
        {releaseSchedule !== 'manual' && (
          <>
            <Text style={styles.introText}>{t('firstEpisodeReleased')}</Text>
            <Text style={styles.introText}>
              {t(releaseSchedule === 'weekly' ? 'chooseDate' : 'chooseTime')}
            </Text>
            <Spacer size="xl" />
          </>
        )}
        {releaseSchedule === 'weekly' && (
          <ReleaseDaySwitch
            selected={weekday}
            setOption={(value) => setWeekday(value)}
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
              testID="datePickerModal"
            />
            <Text style={styles.textResult}>
              {t('videoUnlockSchedule') +
                ' ' +
                t(releaseSchedule === 'weekly' ? 'everyWeek' : 'everyDay')}
            </Text>
            {releaseSchedule === 'weekly' && (
              <>
                <Touchable
                  onPress={(): void =>
                    copyToClipboard(moment(date).format('LLL'))
                  }
                >
                  <Text style={styles.releaseDate}>
                    {moment(date).format(' dddd, LT')}
                  </Text>
                </Touchable>
                <Text style={styles.releaseDue}>
                  {'( ' + t('nextRelease') + ' ' + moment().to(date) + ' )'}
                </Text>
              </>
            )}
          </>
        )}
        {releaseSchedule === 'manual' && (
          <>
            <Text style={styles.manual}>{t('groupReleaseManual')}</Text>
            <Image
              width={280}
              source={tutorials.manualRelease}
              style={styles.manualPicture}
            />
            <Text style={styles.manualSecondary}>
              {t('groupReleaseManualReady')}
            </Text>
          </>
        )}
        <OldButton
          onPress={handleContinue}
          touchableStyle={styles.button}
          isLoading={isLoading}
          testID={'ctaReleaseContinue'}
        >
          <Text style={styles.buttonLabel}>{t('continue')}</Text>
        </OldButton>
      </View>
    </Screen>
  );
};

export default GroupReleaseDate;
