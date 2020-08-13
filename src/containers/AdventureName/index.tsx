import React, { useState, useEffect } from 'react';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useKeyboard from '@rnhooks/keyboard';
import {
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';

import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import NameInput from '../../components/NameInput';
import StatusBar from '../../components/StatusBar';
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';
import Button from '../../components/Button';
import theme from '../../theme';
import BotTalking from '../../components/BotTalking';
import Touchable from '../../components/Touchable';
import {
  sendAdventureInvitation,
  sendVideoInvitation,
} from '../../actions/requests';

function AdventureName(props) {
  const { t } = useTranslation('share');
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [name, setName] = useState('');
  const { width, height } = Dimensions.get('window');

  const { item, withGroup, isVideoInvite = false } = props.route.params;

  const [isKeyboardVisible] = useKeyboard({
    useWillShow: Platform.OS === 'android' ? false : true,
    useWillHide: Platform.OS === 'android' ? false : true,
    // Not availabe on Android https://reactnative.dev/docs/keyboard#addlistener
  });

  const isValidName = (): boolean => name.length > 0;

  async function handleContinue() {
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
        navigation.navigate('AdventureShareCode', {
          invitation: result,
          withGroup,
          isVideoInvite,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(t('needNameTitle'), t('needNameMessage'));
    }
  }

  return (
    <DismissKeyboardView
      style={{
        backgroundColor: theme.colors.primary,
        // paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
        }}
      >
        <SafeAreaView
          style={{
            height: '100%',
            flexDirection: 'column',
            // justifyContent: 'flex-end',
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flex: 1,
              flexDirection: 'column',
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
                  minHeight: 200,
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
                  onChangeText={text => setName(text)}
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
                paddingTop: theme.spacing.xl,
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
                    textAlign: 'center',
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
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </DismissKeyboardView>
  );
}

export default AdventureName;
