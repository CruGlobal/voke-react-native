import React, { useState, useEffect, ReactElement } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import useKeyboard from '@rnhooks/keyboard';

import { RootState } from '../../reducers';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import BotTalking from '../../components/BotTalking';
import st from '../../st';
import Button from '../../components/Button';
import { toastAction } from '../../actions/info';
import theme from '../../theme';
import { createAccount, updateMe } from '../../actions/auth';
import { acceptAdventureInvitation } from '../../actions/requests';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';

function AdventureCode(): ReactElement {
  const { t } = useTranslation('haveCode');
  const insets = useSafeArea();
  const windowDimensions = Dimensions.get('window');
  const navigation = useNavigation();
  const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn);
  const userId = useSelector(({ auth }: RootState) => auth.user.id);
  const firstName = useSelector(({ auth }: RootState) => auth.user.firstName);
  const [adventureCode, setAdventureCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard();

  /*  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []); */

  async function handleContinue() {
    if (adventureCode.length > 3) {
      try {
        setIsLoading(true);
        let currentUserId = null;

        // Before proceeding with invite,
        // check if current user logged-in?
        if (!isLoggedIn) {
          // Create New Account.
          const results = await dispatch(
            // Need '' otherwise API will show 'null' in the user profile later.
            createAccount({
              first_name: '',
              last_name: '',
            }),
          );
          currentUserId = results?.user?.id || null;
        } else {
          currentUserId = userId;
        }

        // acceptAdventureInvitation will return 'Invalid Invite',
        // if the users not set.
        if (!currentUserId) {
          setIsLoading(false);
          return;
        }

        const newAdventure = await dispatch(
          acceptAdventureInvitation(adventureCode),
        );

        if (!firstName) {
          // No first name > user came here from the Welcome screen,
          // continue onboarding process.
          navigation.navigate('AccountName');
        } else {
          // Otherwise, invitation accepted from within an app.
          const isGroup = newAdventure.kind === 'multiple';
          // After entering invite code redirect the user
          // to the group modal or Adventure steps screen.
          if (isGroup) {
            navigation.navigate('GroupModal', {
              adventure: newAdventure || {},
            });
          } else {
            if (newAdventure?.messenger_journey_id) {
              // Go straight into Adventure.
              navigation.navigate('AdventureActive', {
                adventureId: newAdventure?.messenger_journey_id,
              });
            }
          }
          // Backup plan: Redirect to My Adventures screen.
          navigation.navigate('LoggedInApp');
        }
      } catch (error) {
        dispatch(toastAction(t('signUp:invalidCode'), 'short'));
      } finally {
        setIsLoading(false);
      }
    } else {
      dispatch(toastAction(t('signUp:invalidCode'), 'short'));
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        backgroundColor: theme.colors.primary,
        paddingTop: insets.top,
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
          justifyContent: 'center',
        }}
      >
        <DismissKeyboardView
          style={{
            flex: 1,
          }}
        >
          {/* <Flex direction="column" justify="center" align="center" style={[st.w100, st.h100]}> */}
          <View
            style={{
              alignItems: 'center',
              height: '100%',
            }}
          >
            <View
              style={{
                display: isKeyboardVisible && windowDimensions.width < 340 ? 'none' : 'flex',
              }}
            >
              <BotTalking
                heading={t('botMessageTitle')}
                style={{
                  marginTop: isKeyboardVisible && windowDimensions.height < 700 ? 45 : 85,
                  opacity: isKeyboardVisible && windowDimensions.width < 340 ? 0 : 1,
                }}
              >
                {t('botMessageContent')}
              </BotTalking>
            </View>
            <Flex style={{marginTop: isKeyboardVisible ? theme.spacing.xl : theme.spacing.xxl}} />
            <Flex
              direction="column"
              align="center"
              style={[
                st.w100,
                {
                  paddingHorizontal: theme.spacing.xl,
                  justifyContent: 'center',
                },
              ]}
            >
              <TextField
                // blurOnSubmit
                label={t('adventureCode:adventureCode')}
                placeholder="000000"
                value={adventureCode}
                onChangeText={text => setAdventureCode(text)}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                keyboardType="number-pad"
                testID={'inputAdventureCode'}
              />
            </Flex>
            <Flex style={{ minHeight: theme.spacing.l }} />
            <Button
              onPress={handleContinue}
              testID={'ctaAdventureCodeContinue'}
              touchableStyle={[
                st.pd4,
                st.br1,
                isKeyboardVisible ? null : st.mb3,
                st.w(st.fullWidth - 70),
                {
                  backgroundColor: theme.colors.white,
                  textAlign: 'center',
                  // marginTop: isKeyboardVisible ? 0 : 85,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowOpacity: 0.5,
                  elevation: 4,
                  shadowRadius: 5,
                  shadowOffset: { width: 1, height: 8 },
                },
              ]}
              isLoading={isLoading}
            >
              <Text
                style={[st.fs20, st.tac, { color: theme.colors.secondary }]}
              >
                {t('continue')}
              </Text>
            </Button>
            {/* Safety spacing. */}
            <Flex style={{ minHeight: insets.bottom }} />
          </View>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AdventureCode;
