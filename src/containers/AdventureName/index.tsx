/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, ReactElement, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useKeyboard from '@rnhooks/keyboard';
import {
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Platform,
  Keyboard,
  View,
} from 'react-native';

import AccountSignIn from '../AccountSignIn';
import CustomTabs from '../../components/CustomTabs';
import { RootState } from '../../reducers';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
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
  const contentRef = useRef(null);
  const tabsHeightRef = useRef(null);
  const [tabsHeight, setTabsHeight] = useState(0);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

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
          if (withGroup) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        backgroundColor: theme.colors.primary,
        flex: 1,
        height: '100%',
      }}
      enabled={!modalOpen}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          minHeight: '100%',
          flexDirection: 'column',
          alignContent: 'stretch',
          justifyContent: 'center',
        }}
      >
        <DismissKeyboardView
          style={{
            flex: 1,
          }}
        >
          <SafeAreaView
            // edges={['left', 'right', 'bottom']}
            style={{
              height: '100%',
              flexDirection: 'column',
              flex: 1,
              alignContent: 'stretch',
              justifyContent: 'center',
              // backgroundColor: 'blue',
            }}
          >
            <Flex value={1} direction="column" justify="center">
              {isKeyboardVisible && (
                <View style={{ minHeight: theme.spacing.xl }} />
              )}
              <Flex
                align="center"
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
                  heading={
                    withGroup ? t('nameYourGroup') : t('whatIsFriendsName')
                  }
                  style={{
                    opacity: isKeyboardVisible ? 0 : 1,
                  }}
                />
              </Flex>
              <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
                <TextField
                  blurOnSubmit={false}
                  label={
                    withGroup ? t('groupName') : t('placeholder:firstName')
                  }
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
                  testID={'inputFriendsName'}
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
              </Flex>
              <Flex
                // value={1}
                align="center"
                justify="center"
                style={{
                  paddingHorizontal: theme.spacing.xl,
                  paddingTop: isKeyboardVisible
                    ? theme.spacing.l
                    : theme.spacing.xl,
                  // paddingBottom: theme.spacing.xl,
                }}
              >
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
                    elevation: 4,
                    shadowRadius: 5,
                    shadowOffset: { width: 1, height: 8 },
                    width: '100%',
                  }}
                >
                  <Text
                    style={[st.fs20, st.tac, { color: theme.colors.secondary }]}
                  >
                    {t('continue')}
                  </Text>
                </OldButton>
                {/* Safety spacing. */}
                {/* <Flex style={{ minHeight: theme.spacing.xxl }} /> */}
              </Flex>
            </Flex>
            {/* <Flex direction="row" justify="center" style={[st.w100, st.mt1]} /> */}
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
                          layout: 'embed',
                          parentScroll: contentRef,
                          scrollTo: tabsHeight,
                          onComplete: () => {
                            modalizeRef.current?.close();
                            formik.handleSubmit();
                          },
                        },
                      },
                      {
                        key: 'login',
                        title: t('signIn'),
                        component: AccountSignIn,
                        testID: 'tabModalLogin',
                        params: {
                          layout: 'embed',
                          parentScroll: contentRef,
                          scrollTo: tabsHeight,
                          onComplete: () => {
                            modalizeRef.current?.close();
                            formik.handleSubmit();
                          },
                        },
                      },
                    ]}
                    // theme={'White'}
                    // Need to have a second tab open.
                    selectedIndex={1}
                  />
                )}
              </View>
            </Modalize>
          </SafeAreaView>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AdventureName;
