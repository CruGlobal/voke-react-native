/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useRef, useEffect } from 'react';
import {
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Transitioning,
  Transition,
  TransitioningView,
} from 'react-native-reanimated';
import Clipboard from '@react-native-community/clipboard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import useKeyboard from '@rnhooks/keyboard';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import i18next from 'i18next';
import Image from 'react-native-scalable-image';

import manualReleaseExample from '../../assets/manualReleaseExample.png';
import TextField from '../../components/TextField';
import Touchable from '../../components/Touchable';
import { RootState } from '../../reducers';
import { createAccount, updateMe } from '../../actions/auth';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import NameInput from '../../components/NameInput';
import Dropdown from '../../components/Dropdown';
import Datepicker from '../../components/Datepicker';
import Button from '../../components/Button';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import BotTalking from '../../components/BotTalking';
import st from '../../st';
import theme from '../../theme';
import { toastAction } from '../../actions/info';
import {
  sendAdventureInvitation
} from '../../actions/requests';
import styles from './styles';

const GroupReleaseDate = (props): React.ReactElement => {
  const { t } = useTranslation('share');
  const { groupName, itemId, releaseSchedule } = props?.route?.params;
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  // Hooks:
  const [weekday, setWeekday] = useState(moment().format('dddd'));
  const [time, setTime] = useState(
    moment().add(1, 'hours').minute(0).format('h:mm A'),
  );
  const [date, setDate] = useState();
  const [gatingPeriod, setGatingPeriod] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [topMargin, setTopMargin] = useState(0);
  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard({
    useWillShow: Platform.OS === 'android' ? false : true,
    useWillHide: Platform.OS === 'android' ? false : true,
    // Not availabe on Android https://reactnative.dev/docs/keyboard#addlistener
  });
  const windowDimensions = Dimensions.get('window');

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
    const now = new moment();
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
          let result;
          setIsLoading(true);

          result = await dispatch(
            sendAdventureInvitation({
              organization_journey_id: itemId,
              name: groupName,
              kind: 'multiple',
              gating_period: gatingPeriod,
              // Total of days between every step (default 0)
              // - if you want it to be daily it should be: 1;
              // - if you want it to be weekly it should be: 7
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
            Alert.alert(
              'Failed to create a valid invite.',
              'Please try again.',
            );
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

  const copyToClipboard = value => {
    Clipboard.setString(value);
    dispatch(toastAction(t('copied'), 'short'));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        backgroundColor: styles.colors.primary,
        paddingTop: windowDimensions.height > 600 ? headerHeight : insets.top,
        flex: 1,
        height: '100%',
      }}
    >
      {/* <StatusBar /> <- TODO: Not sure why we need it here? */}
      {/* Makes possible to hide keyboard when tapping outside. */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          // flex: 1,
          minHeight: '100%',
          flexDirection: 'column',
          alignContent: 'stretch',
          justifyContent: 'flex-end',
        }}
      >
        <DismissKeyboardView
          style={{
            flex: 1,
          }}
        >
          <Flex
            style={[
              styles.MainContainer,
              {
                alignItems: 'center', // Horizontal.
                justifyContent: 'flex-end', // Vertical.
                flexGrow: 1,
                minHeight: '100%',
              },
            ]}
          >
            <Flex
              style={{
                display: isKeyboardVisible ? 'none' : 'flex',
                paddingTop:
                  windowDimensions.height > 800 ? theme.spacing.xxl : 0,
                paddingBottom:
                  windowDimensions.height > 600 ? theme.spacing.xxl : 0,
              }}
            />
            <Flex
              value={1}
              direction="column"
              align="center"
              self="stretch"
              style={{
                width: '100%',
                paddingHorizontal: theme.spacing.xl,
                justifyContent: isKeyboardVisible ? 'flex-start' : 'flex-start',
              }}
            >
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
                  onChange={newDay => {
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
                    onChange={newTime => {
                      setTime(newTime);
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: theme.colors.secondary,
                    }}
                  >
                    {t('videoUnlockSchedule') +
                      ' ' +
                      t(
                        releaseSchedule === 'weekly' ? 'everyWeek' : 'everyDay',
                      )}
                  </Text>
                  {releaseSchedule === 'weekly' && (
                    <Touchable
                      onPress={() =>
                        copyToClipboard(moment(date).format('LLL'))
                      }
                    >
                      <Text
                        style={{
                          fontSize: theme.fontSizes.l,
                          textAlign: 'center',
                          paddingBottom: theme.spacing.s,
                          color: theme.colors.black,
                        }}
                      >
                        {moment(date).format(' dddd, LT')}
                      </Text>
                    </Touchable>
                  )}
                  <Text style={{ color: theme.colors.secondary }}>
                    {'( ' + t('firstRelease') + ' ' + moment().to(date) + ' )'}
                  </Text>
                </>
              )}
              {releaseSchedule === 'manual' && (
                <>
                  <Text
                    style={{
                      fontSize: theme.fontSizes.l,
                      textAlign: 'center',
                      color: theme.colors.secondary,
                    }}
                  >
                    {t('groupReleaseManual')}
                  </Text>
                  <Image
                    width={280}
                    source={manualReleaseExample}
                    style={{
                      marginVertical: theme.spacing.l,
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: theme.colors.secondary,
                    }}
                  >
                    {t('groupReleaseManualReady')}
                  </Text>
                </>
              )}
              <Button
                onPress={handleContinue}
                touchableStyle={[
                  st.pd4,
                  st.br1,
                  st.w(st.fullWidth - 70),
                  {
                    backgroundColor: theme.colors.white,
                    textAlign: 'center',
                    marginTop: isKeyboardVisible
                      ? theme.spacing.l
                      : theme.spacing.xl,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowOpacity: 0.5,
                    elevation: 4,
                    shadowRadius: 5,
                    shadowOffset: { width: 1, height: 8 },
                  },
                ]}
                isLoading={isLoading}
                testID={'ctaNameContinue'}
              >
                <Text
                  style={[st.fs20, st.tac, { color: theme.colors.secondary }]}
                >
                  {t('continue')}
                </Text>
              </Button>
              {/* Safety spacing. */}
              <Flex
                style={{
                  minHeight: theme.spacing.xl + insets.bottom,
                }}
              />
            </Flex>
          </Flex>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default GroupReleaseDate;
