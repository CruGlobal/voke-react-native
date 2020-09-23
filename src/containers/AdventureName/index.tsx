/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, ReactElement, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import CustomTabs from '../../components/CustomTabs';
import AccountSignIn from '../AccountSignIn';
import * as Yup from 'yup';
import useKeyboard from '@rnhooks/keyboard';
import {
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';

import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import st from '../../st';
import Button from '../../components/Button';
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
  const { item, withGroup, isVideoInvite = false } = props.route.params;
  const email = useSelector(({ auth }: any) => auth?.user?.email);

  const modalizeRef = useRef<Modalize>(null);

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
      setModalOpen(true);
      return;
      // Before sending a group name to the server
      // we need to check if user isn't a guest user.
      if (!email) {
        console.log('Need to register');
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
            Alert.alert('Failed to create a valid invite.', 'Please try again.');
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
            edges={['left', 'right', 'bottom']}
            style={{
              height: '100%',
              flexDirection: 'column',
              flex: 1,
              alignContent: 'stretch',
              justifyContent: 'center',
            }}
          >
            <Flex direction="column" self="stretch">
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
            </Flex>
            {/* <Flex direction="row" justify="center" style={[st.w100, st.mt1]} /> */}
            <Flex
              // value={1}
              align="center"
              justify="center"
              style={{
                paddingHorizontal: theme.spacing.xl,
                paddingTop: isKeyboardVisible
                  ? theme.spacing.l
                  : theme.spacing.xl,
                paddingBottom: theme.spacing.xl,
              }}
            >
              <Button
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
              </Button>
              {/* Safety spacing. */}
              {/* <Flex style={{ minHeight: theme.spacing.xxl }} /> */}
            </Flex>
            <Modalize
              ref={modalizeRef}
              modalTopOffset={140}
              handlePosition={'inside'}
              openAnimationConfig={{
                timing: { duration: 300 }
              }}
              onClose={() => setModalOpen(false)}
              modalStyle={{
                backgroundColor: theme.colors.primary
              }}
            >
              <Text style={styles.modalTitle}>{t('modal:accountRequired')}</Text>
              <CustomTabs
                tabs={[
                  {
                    key: 'signup',
                    title: t('signUp'),
                    component: AccountCreate,
                    testID: 'tabModalSignUp',
                  },
                  {
                    key: 'login',
                    title: t('login'),
                    component: AccountSignIn,
                    testID: 'tabModalLogin',
                  }
                ]}
                // theme={'White'}
                // If there are any Adventures or Invites:
                // Show My Adventures tab first.
                // Otherwise redirect user to Find Adventures.
                selectedIndex={1}
              />
              {/* <AccountSignIn /> */}
            </Modalize>
          </SafeAreaView>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AdventureName;
