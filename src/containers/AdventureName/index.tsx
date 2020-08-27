/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, ReactElement } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useKeyboard from '@rnhooks/keyboard';
import {
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';

import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import NameInput from '../../components/NameInput';
import st from '../../st';
import Button from '../../components/Button';
import theme from '../../theme';
import BotTalking from '../../components/BotTalking';
import Touchable from '../../components/Touchable';
import {
  sendAdventureInvitation,
  sendVideoInvitation,
} from '../../actions/requests';

function AdventureName(props: any): ReactElement {
  const { t } = useTranslation('share');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [name, setName] = useState('');

  const { item, withGroup, isVideoInvite = false } = props.route.params;

  const [isKeyboardVisible] = useKeyboard({
    useWillShow: Platform.OS === 'android' ? false : true,
    useWillHide: Platform.OS === 'android' ? false : true,
    // Not availabe on Android https://reactnative.dev/docs/keyboard#addlistener
  });

  const isValidName = (): boolean => name.length > 0;

  const handleContinue = async (): Promise<void> => {
    if (isValidName() && !isLoading) {
      try {
        setIsLoading(true);
        let result;
        if (isVideoInvite) {
          // TODO: check this scenario.
          result = await dispatch(
            sendVideoInvitation({
              name,
              item_id: `${item.id}`,
            }),
          );
        } else {
          result = await dispatch(
            sendAdventureInvitation({
              organization_journey_id: item.id,
              name,
              kind: withGroup ? 'multiple' : 'duo',
            }),
          );
        }

        if (result?.code) {
          navigation.navigate('AdventureShareCode', {
            invitation: result,
            withGroup,
            isVideoInvite,
          });
        } else {
          Alert.alert('Failed to create a valid invite.', 'Please try again.');
        }

        /* SUCCESS RESULT EXAMPLE
        {
          id: "78b4bf04-6630-46af-8e9f-7cc70e05b5bb"
          messenger_journey_id: "52ca64d4-2a53-4e41-a755-5002e3b29900"
          code: "386621"
          name: "Sdsdfsdfdf"
          kind: "duo"
          status: "waiting"
          ...
        } */
      } catch (e) {
        if (e?.message === 'Network request failed') {
          Alert.alert(e?.message, t('checkInternet'));
        } else if (e?.message) {
          Alert.alert(e?.message);
        } else {
          console.error(e);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(t('needNameTitle'), t('needNameMessage'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        backgroundColor: theme.colors.primary,
        flex: 1,
        height: '100%',
      }}
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
                <NameInput
                  blurOnSubmit={false}
                  label={
                    withGroup ? t('groupName') : t('placeholder:firstName')
                  }
                  onSubmitEditing={handleContinue}
                  placeholder={
                    withGroup ? t('groupName') : t('placeholder:friendsName')
                  }
                  value={name}
                  onChangeText={(text: string): void => setName(text)}
                  returnKeyType="done"
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
                onPress={handleContinue}
                touchableStyle={[
                  st.pd4,
                  st.br1,
                  // st.w(st.fullWidth - 70),
                  {
                    backgroundColor: theme.colors.white,
                    // marginTop: isKeyboardVisible ? 0 : 85,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowOpacity: 0.5,
                    elevation: 4,
                    shadowRadius: 5,
                    shadowOffset: { width: 1, height: 8 },
                    width: '100%',
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
              {/* <Flex style={{ minHeight: theme.spacing.xxl }} /> */}
            </Flex>
          </SafeAreaView>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AdventureName;
