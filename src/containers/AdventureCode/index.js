import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Alert, Keyboard } from 'react-native';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import NameInput from '../../components/NameInput';
import StatusBar from '../../components/StatusBar';
import BotTalking from '../../components/BotTalking'
import st from '../../st';
import Button from '../../components/Button';
import { toastAction } from '../../actions/info';

// import { MONTHLY_PRICE } from '../../constants';
import theme from '../../theme';
import { createAccount, updateMe } from '../../actions/auth';
import { acceptAdventureInvitation } from '../../actions/requests';

function AdventureCode(props) {
  const { t } = useTranslation('haveCode');
  const insets = useSafeArea();
  const navigation = useNavigation();
  const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn);
  const userId = useSelector(
    ({ auth }: RootState) => auth.user.id,
  );
  const firstName = useSelector(
    ({ auth }: RootState) => auth.user.firstName,
  );
  const [adventureCode, setAdventureCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
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
  }, []);

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
          currentUserId = results?.user?.id || null
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
          navigation.navigate('AccountName')
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
            if ( newAdventure?.messenger_journey_id ) {
              // Go straight into Adventure.
              navigation.navigate('AdventureActive', {
                adventureId: newAdventure?.messenger_journey_id,
              })
            }
          }
          // Backup plan: Redirect to My Adventures screen.
          navigation.navigate('LoggedInApp');
        }
      } catch (error) {
        dispatch(toastAction( t('signUp:invalidCode'), 'short' ));
      } finally {
        setIsLoading(false);
      }
    } else {
      dispatch(toastAction( t('signUp:invalidCode'), 'short' ));
    }
  }

  return (
    <>
      <StatusBar />
      <KeyboardAvoidingView
        behavior="padding"
        style={[
          st.aic,
          st.w100,
          st.jcsb,
          st.bgBlue,
          { paddingTop: insets.top },
        ]}
      >
        <Flex direction="column" justify="center" style={[st.w100, st.h100]}>
          <Flex direction="column" style={[st.mt1]}>
            <BotTalking heading={t('botMessageTitle')}>{t('botMessageContent')}</BotTalking>
            <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
            <NameInput
                blurOnSubmit
                label={t('adventureCode:adventureCode')}
                placeholder="00000"
                value={adventureCode}
                onChangeText={text => setAdventureCode(text)}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                keyboardType="number-pad"
              />
            </Flex>
          </Flex>
          <Flex direction="row" justify="center" style={[st.w100, st.mt2]}/>
          <Flex value={1} align="center">
          <Button
            onPress={handleContinue}
            touchableStyle={[st.pd4, st.br1, st.mb3, st.w(st.fullWidth - 70),{backgroundColor: theme.colors.white, textAlign:"center", marginTop: isKeyboardVisible ? 0 : 85, shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 4,
            shadowRadius: 5 ,
            shadowOffset : { width: 1, height: 8}}]}
            isLoading={isLoading}
          >
            <Text style={[st.fs20, st.tac, {color:theme.colors.secondary}]}>{t('continue')}</Text>

          </Button>
           {/* Safety spacing. */}
           <Flex style={{ height: (isKeyboardVisible ? 0 : insets.bottom ) }} />
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </>
  );
}

export default AdventureCode;
