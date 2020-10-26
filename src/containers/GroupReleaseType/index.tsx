/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, ReactElement, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useKeyboard from '@rnhooks/keyboard';
import Carousel from 'react-native-snap-carousel';
import {
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Platform,
  Keyboard,
  View,
  Dimensions,
} from 'react-native';

import VokeIcon from '../../components/VokeIcon';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import st from '../../st';
import OldButton from '../../components/OldButton';
import theme from '../../theme';
import BotTalking from '../../components/BotTalking';
import Touchable from '../../components/Touchable';
import {
  sendAdventureInvitation,
  sendVideoInvitation,
} from '../../actions/requests';
import AccountCreate from '../AccountCreate';
import Screen from '../../components/Screen';

import styles from './styles';

function GroupReleaseType(props: any): ReactElement {
  const {
    groupName,
    itemId,
    releaseSchedule,
    releaseDate,
    editing = false,
    adventureId,
  } = props.route.params;
  const { t } = useTranslation('share');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHeight, setModalHeight] = useState(0);
  const { width, height } = Dimensions.get('window');
  // const email = useSelector(({ auth }: any) => auth?.user?.email);

  const [isKeyboardVisible] = useKeyboard({
    useWillShow: Platform.OS === 'android' ? false : true,
    useWillHide: Platform.OS === 'android' ? false : true,
    // Not availabe on Android https://reactnative.dev/docs/keyboard#addlistener
  });

  const NameValidationSchema = Yup.object().shape({
    name: Yup.string().required(t('required')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: NameValidationSchema,
    onSubmit: async values => {
      Keyboard.dismiss();
      // Before sending a group name to the server
      // we need to check if user isn't a guest user.
      if (!email) {
        setModalOpen(true);
      } else {
        try {
          setIsLoading(true);
          let result;
          if (isVideoInvite) {
            // TODO: check this scenario.
            result = await dispatch(
              sendVideoInvitation({
                name: values.name,
                item_id: `${item.id}`,
              }),
            );
          } else {
            result = await dispatch(
              sendAdventureInvitation({
                organization_journey_id: item.id,
                name: values.name,
                kind: withGroup ? 'multiple' : 'duo',
              }),
            );
          }

          if (result?.id) {
            navigation.navigate('AdventureShareCode', {
              invitation: result,
              withGroup,
              isVideoInvite,
            });
          } else {
            Alert.alert(
              'Failed to create a valid invite.',
              'Please try again.',
            );
          }
        } catch (e) {
          if (e?.message === 'Network request failed') {
            Alert.alert(e?.message, t('checkInternet'));
          } else if (e?.message) {
            Alert.alert(e?.message);
          } else {
            console.error(e);
          }
        }
      }
    },
  });

  const cardAction = type => {
    navigation.navigate('GroupReleaseDate', {
      groupName: groupName,
      itemId: itemId,
      releaseSchedule: type,
      editing: editing,
      releaseDate: releaseDate,
      adventureId: adventureId,
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: 'floralwhite',
          borderRadius: theme.radius.l,
          height: width * 0.8,
          // width: 100,
          paddingHorizontal: theme.spacing.l,
          paddingVertical: theme.spacing.xl,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        testID={'releaseOption-' + (index + 1)}
      >
        <VokeIcon
          name={item.icon}
          style={{
            color: theme.colors.primary,
          }}
          size={50}
        />
        <Text style={{ fontSize: theme.fontSizes.xxl }}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text
          style={{
            color: theme.colors.orange,
            // position: 'absolute',
            top: -theme.spacing.s,
          }}
        >
          {index === 0 ? t('recommended') : ''}
        </Text>
        <OldButton
          onPress={item.buttonAction}
          testID={'ctaContinueOption-' + (index+1)}
          touchableStyle={{
            padding: theme.spacing.s,
            backgroundColor: theme.colors.secondary,
            borderRadius: theme.radius.xxl,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 4,
            shadowRadius: 5,
            shadowOffset: { width: 1, height: 8 },
            width: '60%',
          }}
        >
          <Text
            style={{
              fontSize: theme.fontSizes.l,
              lineHeight: theme.fontSizes.l * 1.5,
              textAlign: 'center',
              color: theme.colors.white,
            }}
          >
            {t('select')}
          </Text>
        </OldButton>
      </View>
    );
  };

  const initalItem = currentSchedule => {
    switch (currentSchedule) {
      case 'daily':
        return 1;
        break;
      case 'weekly':
        return 0;
        break;
      case 'manual':
        return 2;
      default:
        return 0;
        break;
    }
  };

  return (
    <Screen testID="groupReleaseType" noKeyboard>
      <Flex value={1} direction="column" justify="center">
        {isKeyboardVisible && <View style={{ minHeight: theme.spacing.xl }} />}
        <Flex
          // align="center"
          justify="center"
          style={{
            display: isKeyboardVisible ? 'none' : 'flex',
            // paddingBottom: theme.spacing.xl,
            // paddingTop: height > 800 ? theme.spacing.xl : 0,
            // minHeight: 200,
            paddingBottom: theme.spacing.xl,
          }}
        >
          <BotTalking
            heading={t('groupReleaseSchedule')}
            style={{
              opacity: isKeyboardVisible ? 0 : 1,
            }}
          />
        </Flex>
        <View style={{ minHeight: theme.spacing.xxl }} />
        <Flex direction="column" justify="center">
          <Carousel
            firstItem={initalItem(releaseSchedule)}
            containerCustomStyle={{
              marginHorizontal:
                theme.window.width < 375 ? -theme.spacing.l : -theme.spacing.xl,
            }}
            // ref={(c) => { this._carousel = c; }}
            data={[
              {
                icon: 'month',
                title: 'Weekly Releases',
                description: 'Automatically release videos once a week.',
                buttonLabel: 'Select',
                buttonAction: () => cardAction('weekly'),
              },
              {
                icon: 'date',
                title: 'Daily Releases',
                description: 'Automatically release videos every day.',
                buttonLabel: 'Select',
                buttonAction: () => cardAction('daily'),
              },
              {
                icon: 'cog',
                title: 'Manual Releases',
                description: 'Release videos manually, whenever you’re ready.',
                buttonLabel: 'Select',
                buttonAction: () => cardAction('manual'),
              },
            ]}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width - 80}
            layout={'default'}
            removeClippedSubviews={false}
            // onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
          />
        </Flex>
        <View style={{ minHeight: theme.spacing.xxl }} />
      </Flex>
    </Screen>
  );
}

export default GroupReleaseType;
