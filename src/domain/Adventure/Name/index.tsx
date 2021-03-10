/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import AccountSignIn from 'domain/Account/containers/AccountSignIn';
import AccountCreate from 'domain/Account/containers/AccountCreate';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState, ReactElement, useRef, useEffect } from 'react';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useKeyboard } from '@react-native-community/hooks';
import { Alert, ScrollView, Platform, Keyboard, View } from 'react-native';
import CustomTabs from 'components/CustomTabs';
import Flex from 'components/Flex';
import Text from 'components/Text';
import TextField from 'components/TextField';
import OldButton from 'components/OldButton';
import BotTalking from 'components/BotTalking';
import Touchable from 'components/Touchable';
import Screen from 'components/Screen';
import { sendAdventureInvitation, sendVideoInvitation } from 'actions/requests';
import theme from 'utils/theme';
import st from 'utils/st';
import moment from 'moment';
import CONSTANTS from 'utils/constants';

import styles from './styles';

function AdventureName(props: any): ReactElement {
  const { t } = useTranslation('share');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHeight, setModalHeight] = useState(0);
  const { item, withGroup, isVideoInvite = false } = props.route.params;
  const email = useSelector(({ auth }: any) => auth?.user?.email);

  const modalizeRef = useRef<Modalize>(null);
  const contentRef = useRef<React.RefObject<ScrollView>>(null);
  const tabsHeightRef = useRef(null);
  const [tabsHeight, setTabsHeight] = useState(0);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const keyboard = useKeyboard();

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
          if (
            withGroup &&
            item.id !== CONSTANTS.ADV_EASTER
            // If not Easter Adventure.
          ) {
            // GROUP Adventure
            navigation.navigate('GroupReleaseType', {
              groupName: values.name,
              itemId: `${item.id}`,
            });
          } else {
            // DUO or SOLO  Adventure
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
                  gating_period: item.id === CONSTANTS.ADV_EASTER ? 0 : null,
                  // If Easter Adventure.
                  gating_start_at:
                    item.id === CONSTANTS.ADV_EASTER
                      ? moment().utc().format()
                      : null,
                }),
              );
            }

            if (result?.id) {
              navigation.navigate('AdventureShareCode', {
                invitation: result,
                withGroup,
                isVideoInvite,
                onClose: () => {
                  return navigation.navigate('AdventureActive', {
                    adventureId: result?.messenger_journey_id,
                  });
                },
              });
            } else {
              Alert.alert(
                'Failed to create a valid invite.',
                'Please try again.',
              );
            }
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

  useEffect(() => {
    if (modalOpen) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [modalOpen]);

  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      // When the screen is focused:
      // - Do something here.
      setIsLoading(false);
      return (): void => {
        // When the screen is unfocused:
        // - Pause video.
      };
    }, []),
  );

  return (
    <Screen noKeyboard={modalOpen} bounces={false}>
      {/* <View style={{ minHeight: keyboard.keyboardShown ? theme.spacing.xl : 0 }} /> */}
      <Flex
        value={1}
        direction="column"
        align="center"
        self="stretch"
        style={{
          justifyContent: keyboard.keyboardShown ? 'center' : 'center',
        }}
      >
        <BotTalking
          heading={withGroup ? t('nameYourGroup') : t('whatIsFriendsName')}
          style={{
            opacity: keyboard.keyboardShown ? 0 : 1,
            display: keyboard.keyboardShown ? 'none' : 'flex',
            paddingBottom: theme.spacing.xxl,
          }}
        />
        <TextField
          blurOnSubmit={false}
          label={withGroup ? t('groupName') : t('placeholder:firstName')}
          placeholder={
            withGroup ? t('groupName') : t('placeholder:friendsName')
          }
          value={formik.values.name}
          returnKeyType="done"
          onBlur={formik.handleBlur('name')}
          onChangeText={formik.handleChange('name')}
          onSubmitEditing={formik.handleSubmit}
          error={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : null
          }
          testID={'inputName'}
        />
        <Touchable onPress={() => setShowHelp(!showHelp)}>
          <Text style={[st.offBlue, st.fs14, st.pt3, st.tac, st.ph1]}>
            {showHelp
              ? withGroup
                ? t('placeholder:whyNeedGroupName')
                : t('placeholder:whyNeedFriendsName')
              : t('placeholder:whyDoWeWantThis')}
          </Text>
        </Touchable>
        <Flex
          style={{
            minHeight: keyboard.keyboardShown
              ? theme.spacing.l
              : theme.spacing.xl,
          }}
        />
        <OldButton
          onPress={formik.handleSubmit}
          isLoading={isLoading}
          testID={'ctaContinue'}
          touchableStyle={{
            padding: theme.spacing.m,
            backgroundColor: theme.colors.white,
            borderRadius: theme.radius.xxl,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 3,
            shadowRadius: 5,
            shadowOffset: { width: 1, height: 8 },
            width: '100%',
          }}
        >
          <Text style={[st.fs20, st.tac, { color: theme.colors.secondary }]}>
            {t('continue')}
          </Text>
        </OldButton>
      </Flex>
      <Modalize
        ref={modalizeRef}
        contentRef={ref => {
          if (ref) {
            contentRef.current = ref;
          }
        }}
        modalTopOffset={100}
        handlePosition={'inside'}
        openAnimationConfig={{
          timing: { duration: 300 },
        }}
        onClose={() => setModalOpen(false)}
        rootStyle={{
          elevation: 5, // need it here to solve issue with button shadow.
        }}
        modalStyle={{
          backgroundColor: theme.colors.primary,
        }}
        onLayout={e => {
          setModalHeight(e.layout.height);
        }}
      >
        <View
          style={{
            minHeight: modalHeight,
          }}
        >
          <View
            onLayout={({ nativeEvent }) => {
              // Calculate of the tabs in pixels.
              const layout = nativeEvent?.layout;
              if (layout && layout?.height) {
                setTabsHeight(layout.height);
              }
            }}
          >
            <View style={styles.modalTitleArea}>
              <View style={styles.modalTitleAction}>
                <Touchable
                  onPress={() => {
                    modalizeRef.current?.close();
                  }}
                  style={styles.buttonTitleCancel}
                >
                  <Text style={styles.buttonLabelTitleCancel}>
                    {t('cancel')}
                  </Text>
                </Touchable>
              </View>
              <Text style={styles.modalTitle}>
                {t('modal:accountRequiredTitle')}
              </Text>
              <View style={styles.modalTitleAction}>
                <Text>.</Text>
              </View>
            </View>
            <Text style={styles.modalIntro}>
              {t('modal:accountRequiredIntro')}
            </Text>
          </View>
          {/* Kill unwanted rerenders by waiting for tabsHeight & contentRef*/}
          {!!tabsHeight && contentRef.current && (
            <CustomTabs
              style={{
                flexGrow: 1,
              }}
              tabs={[
                {
                  key: 'signup',
                  title: t('signUp'),
                  component: AccountCreate,
                  testID: 'tabModalSignUp',
                  params: {
                    route: {
                      params: {
                        layout: 'embed',
                        parentScroll: contentRef,
                        scrollTo: tabsHeight,
                        onComplete: (): void => {
                          modalizeRef.current?.close();
                          formik.handleSubmit();
                        },
                      },
                    },
                  },
                },
                {
                  key: 'login',
                  title: t('signIn'),
                  component: AccountSignIn,
                  testID: 'tabModalLogin',
                  params: {
                    route: {
                      params: {
                        layout: 'embed',
                        parentScroll: contentRef,
                        scrollTo: tabsHeight,
                        onComplete: (): void => {
                          modalizeRef.current?.close();
                          formik.handleSubmit();
                        },
                      },
                    },
                  },
                },
              ]}
              selectedIndex={0}
            />
          )}
        </View>
      </Modalize>
    </Screen>
  );
}

export default AdventureName;
