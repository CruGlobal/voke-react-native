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
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import useKeyboard from '@rnhooks/keyboard';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../reducers';
import { createAccount, updateMe } from '../../actions/auth';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import NameInput from '../../components/NameInput';
import OldButton from '../../components/OldButton';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import BotTalking from '../../components/BotTalking';
import st from '../../st';
import theme from '../../theme';

import styles from './styles';

const AccountName = (props): React.ReactElement => {
  const { t } = useTranslation('name');
  const onComplete = props?.route?.params?.onComplete;
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  // State:
  const initialFirstName = useSelector(
    ({ auth }: RootState) => auth.user.firstName,
  );
  const initialLastName = useSelector(
    ({ auth }: RootState) => auth.user.lastName,
  );
  const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn);
  // Hooks:
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const lastNameRef = useRef(null);
  const [topMargin, setTopMargin] = useState(0);
  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard({
    useWillShow: Platform.OS === 'android' ? false : true,
    useWillHide: Platform.OS === 'android' ? false : true,
    // Not availabe on Android https://reactnative.dev/docs/keyboard#addlistener
  });
  const windowDimensions = Dimensions.get('window');
  // const refBotBlock = useRef();
  const refBotBlock = useRef<TransitioningView>(null);
  // const transition = <Transition.Change interpolation="easeInOut" />;
  const transition = (
    <Transition.Together>
      <Transition.Change interpolation="easeInOut" />
    </Transition.Together>
  );

  useEffect(() => {
    if (isKeyboardVisible) {
      setTopMargin(-300);
    } else {
      setTopMargin(theme.spacing.l);
    }
    refBotBlock?.current?.animateNextTransition();
  }, [isKeyboardVisible]);

  const nextScreen = (screenName = 'AccountPhoto') => {
    if (onComplete) {
      return onComplete();
    } else {
      return navigation.navigate(screenName);
    }
  };

  const handleContinue = async () => {
    if (!firstName || firstName.length < 1) {
      return Alert.alert(t('needNameTitle'), t('needNameMessage'));
    }
    if (
      firstName === initialFirstName &&
      lastName === initialLastName &&
      isLoggedIn
    ) {
      // Nothing changed
      return nextScreen();
    }
    setIsLoading(true);

    if (!isLoggedIn) {
      // Create New Account.
      await dispatch(
        createAccount({
          first_name: firstName,
          last_name: lastName,
        }),
      );
    } else {
      try {
        // Update Existing Account.
        await dispatch(
          updateMe({
            first_name: firstName,
            last_name: lastName,
          }),
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("🛑 Error updating the user's details \n", e);
        Alert.alert(e.error_description ? e.error_description : e.errors[0]);
      }
    }

    setIsLoading(false);

    // Go to the next screen.
    return nextScreen();
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
              direction="row"
              align="start"
              justify="between"
              style={{
                display: isKeyboardVisible ? 'none' : 'flex',
                paddingTop:
                  windowDimensions.height > 800 ? theme.spacing.xxl : 0,
                paddingBottom:
                  windowDimensions.height > 600 ? theme.spacing.xxl : 0,
                // Don't set height for bot messages!
                // It should be flexible for every screen.
              }}
            >
              <BotTalking
                heading={t('introTitle')}
                style={{
                  opacity: isKeyboardVisible ? 0 : 1,
                }}
              >
                {t('introMessage')}
              </BotTalking>
            </Flex>
            <Flex
              value={1}
              direction="column"
              align="center"
              self="stretch"
              style={{
                width: '100%',
                paddingHorizontal: theme.spacing.xl,
                justifyContent: isKeyboardVisible
                  ? 'flex-start'
                  : 'flex-start',
              }}
            >
              <NameInput
                blurOnSubmit={false}
                label={t('tryItNow:firstName')}
                onSubmitEditing={() => lastNameRef.current.focus()}
                placeholder={t('tryItNow:firstNamePlaceholder')}
                value={firstName}
                onChangeText={text => setFirstName(text)}
                returnKeyType="next"
                testID={'inputFirstName'}
              />
              <NameInput
                ref={lastNameRef}
                blurOnSubmit
                label={t('tryItNow:lastName')}
                placeholder={t('tryItNow:lastNamePlaceholder')}
                value={lastName}
                onChangeText={text => setLastName(text)}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                testID={'inputLastName'}
              />
              <OldButton
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
                  {t('next')}
                </Text>
              </OldButton>
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

export default AccountName;
