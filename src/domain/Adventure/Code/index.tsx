import React, { useState, ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  View,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useKeyboard } from '@react-native-community/hooks';
import Flex from 'components/Flex';
import Text from 'components/Text';
import TextField from 'components/TextField';
import BotTalking from 'components/BotTalking';
import OldButton from 'components/OldButton';
import Screen from 'components/Screen';
import theme from 'utils/theme';
import { RootState, useDispatchTs } from 'reducers';
import st from 'utils/st';
import { TInvitation } from 'utils/types';

import { toastAction } from '../../../actions/info';
import { createAccount } from '../../../actions/auth';
import { acceptAdventureInvitation } from '../../../actions/requests';

import styles from './styles';

function AdventureCode(): ReactElement {
  const { t } = useTranslation('haveCode');
  const windowDimensions = Dimensions.get('window');
  const navigation = useNavigation();
  const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn);
  const userId = useSelector(({ auth }: RootState) => auth.user.id);
  const firstName = useSelector(({ auth }: RootState) => auth.user.firstName);
  const [adventureCode, setAdventureCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatchTs();
  // https://github.com/react-native-hooks/keyboard#configuration
  const keyboard = useKeyboard();
  // const Screen = useScreenContainer();

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

        const acceptedAdventureInvite = await dispatch(
          acceptAdventureInvitation(adventureCode),
        );

        if (!firstName) {
          // No first name > user came here from the Welcome screen,
          // continue onboarding process.
          return navigation.navigate('AccountName');
        } else {
          // Otherwise, invitation accepted from within an app.
          const isGroup = acceptedAdventureInvite.kind === 'multiple';
          // After entering invite code redirect the user
          // to the group modal or Adventure steps screen.
          if (isGroup) {
            if (acceptedAdventureInvite?.messenger_journey_id) {
              return navigation.navigate('GroupModal', {
                adventureId: acceptedAdventureInvite.messenger_journey_id,
              });
            } else {
              console.log(
                '🛑 Error getting adventure id from accepted invite',
                acceptedAdventureInvite,
              );
            }
          } else {
            if (acceptedAdventureInvite?.messenger_journey_id) {
              // Go straight into Adventure.
              return navigation.navigate('AdventureActive', {
                adventureId: acceptedAdventureInvite?.messenger_journey_id,
              });
            }
          }
          // Backup plan: Redirect to My Adventures screen.
          return navigation.navigate('LoggedInApp');
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
    <Screen testID={'adventureCodeScreen'}>
      <View
        style={{
          marginTop:
            Platform.OS === 'ios' &&
            keyboard.keyboardShown &&
            windowDimensions.height < 700
              ? -40
              : 0,
          // Vertically align form on smaller iPhone screens.
          display:
            keyboard.keyboardShown && windowDimensions.height < 600
              ? 'none'
              : 'flex',
        }}
      >
        <BotTalking
          heading={t('botMessageTitle')}
          style={{
            marginTop:
              keyboard.keyboardShown && windowDimensions.height < 700 ? 45 : 85,
            opacity:
              keyboard.keyboardShown && windowDimensions.width < 340 ? 0 : 1,
          }}
        >
          {t('botMessageContent')}
        </BotTalking>
      </View>
      <Flex
        style={{
          minHeight: theme.spacing.xl,
        }}
      />
      <Flex
        direction="column"
        style={{
          // justifyContent: 'center',
          alignSelf: 'stretch', // horizontal
        }}
      >
        <TextField
          // blurOnSubmit
          label={t('adventureCode:adventureCode')}
          placeholder="000000"
          value={adventureCode}
          onChangeText={text => setAdventureCode(text.trim())}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
          keyboardType="number-pad"
          testID={'inputAdventureCode'}
        />
      </Flex>
      <Flex style={{ minHeight: theme.spacing.l }} />
      <OldButton
        onPress={handleContinue}
        testID={'ctaAdventureCodeContinue'}
        touchableStyle={[
          st.pd4,
          st.br1,
          keyboard.keyboardShown ? null : st.mb3,
          // st.w(st.fullWidth - 70),
          {
            backgroundColor: theme.colors.white,
            textAlign: 'center',
            // marginTop: keyboard.keyboardShown ? 0 : 85,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 4,
            shadowRadius: 5,
            shadowOffset: { width: 1, height: 8 },
            alignSelf: 'stretch',
          },
        ]}
        isLoading={isLoading}
      >
        <Text style={[st.fs20, st.tac, { color: theme.colors.secondary }]}>
          {t('continue')}
        </Text>
      </OldButton>
      <Flex
        style={{
          minHeight: keyboard.keyboardShown
            ? theme.spacing.xxl
            : theme.spacing.xxl,
        }}
      />
    </Screen>
  );
}

export default AdventureCode;
