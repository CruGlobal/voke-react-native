import React, { useState, useRef } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import analytics from '@react-native-firebase/analytics';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import Share from 'react-native-share';
import { useHeaderHeight } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import ModalNotifications from 'components/ModalNotifications';
import ModalHowSharingWorks from 'components/ModalHowSharingWorks';
import Flex from 'components/Flex';
import Text from 'components/Text';
import StatusBar from 'components/StatusBar';
import OldButton from 'components/OldButton';
import BotTalking from 'components/BotTalking';
import Touchable from 'components/Touchable';
import Screen from 'components/Screen';
import theme from 'utils/theme';
import st from 'utils/st';
import { RootState } from 'reducers';

import { toastAction } from '../../../actions/info';

function AdventureShareCode(props) {
  const { invitation, withGroup, isVideoInvite } = props.route.params;
  const modalizeRef = useRef<Modalize>(null);
  const modalizeSharingRef = useRef<Modalize>(null);
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation('share');
  const { pushNotificationPermission } = useSelector(
    ({ info }: RootState) => info,
  );
  const askedNotifications = useRef(false);
  const headerHeight = useHeaderHeight();
  const windowDimensions = Dimensions.get('window');
  const [modalId, setModalId] = useState(null);
  let popupTimeout = null;

  const handleShare = () => {
    Share.open(
      {
        message: isVideoInvite
          ? t('share:shareMessageVideo', {
              friend: ' ' + invitation?.first_name,
              link: invitation.url,
            })
          : t('share:shareMessage', {
              friend: withGroup ? '' : ' ' + invitation?.name,
              link: invitation?.preview_journey_url,
              code: invitation?.code,
            }),
        // {t('downloadMessage')}`Download Voke and join my ${invitation.name} Adventure. Use code: ${invitation.code} ${CONSTANTS.APP_URL}`,
      },
      /* ,
      {
        dialogTitle: t('share'),
      }, */
    )
      .then(res => {
        // Google Analytics: Record share action.
        // https://rnfirebase.io/reference/analytics#logShare
        analytics().logShare({
          content_type: isVideoInvite ? 'Video' : 'Adventure',
          item_id: invitation.organization_journey.name,
          method: res?.app || '', //ex: "com.apple.UIKit.activity.CopyToPasteboard"
        });
      })
      .catch(err => console.log('Share Error', err));
  };

  const copyToClipboard = value => {
    Clipboard.setString(value);
    dispatch(toastAction(t('copied'), 'short'));
  };

  const askNotificationPermissions = (): void => {
    if (!askedNotifications.current) {
      askedNotifications.current = true;
      if (pushNotificationPermission !== 'granted') {
        modalizeRef.current?.open();
      }
    }
  };

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      // When the screen is focused:
      // Ask for notifications permissions.
      if (pushNotificationPermission !== 'granted') {
        popupTimeout = setTimeout(() => askNotificationPermissions(), 600);
      }
      return (): void => {
        // When the screen is unfocused:
        clearTimeout(popupTimeout);
      };
    }, []),
  );

  return (
    <Screen testID={'adventureShareCode'}>
      <StatusBar />
      {/* Extra space to compensate for header */}
      <Flex direction="column" justify="center">
        <Flex direction="column" align="center" justify="center">
          <BotTalking>
            {withGroup
              ? t('share:groupPreviewLinkReady', { name: invitation.name })
              : isVideoInvite
              ? t('share:linkReady')
              : t('share:previewLinkReady', { name: invitation.name })}
          </BotTalking>
        </Flex>
        <Flex style={{ minHeight: theme.spacing.xxxl }} />
        {isVideoInvite && (
          <Flex direction="column" align="center">
            <Text style={[st.fs22, st.white, st.pb4]}>{t('inviteLink')}: </Text>
            <Touchable
              onPress={() => copyToClipboard(invitation.url)}
              style={{ width: '100%' }}
            >
              <Flex
                style={[
                  st.bw1,
                  st.borderWhite,
                  st.br5,
                  st.bgOffBlue,
                  st.pv5,
                  st.ph4,
                  { width: '100%' },
                ]}
              >
                <Text style={[st.white, { fontSize: 18, textAlign: 'center' }]}>
                  {isVideoInvite ? invitation.url : invitation.code}
                </Text>
              </Flex>
            </Touchable>
            <OldButton
              isAndroidOpacity
              style={[
                st.pd4,
                st.br1,
                st.white,
                st.mt1,
                st.w(st.fullWidth - 70),
                {
                  backgroundColor: theme.colors.white,
                  textAlign: 'center',
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowOpacity: 0.5,
                  elevation: 4,
                  shadowRadius: 5,
                  shadowOffset: { width: 1, height: 8 },
                },
              ]}
              onPress={handleShare}
            >
              <Text
                style={[st.fs20, st.tac, { color: theme.colors.secondary }]}
              >
                {t('share')}
              </Text>
            </OldButton>
            <Flex style={{ minHeight: theme.spacing.xl }} />
          </Flex>
        )}
        {!isVideoInvite && (
          <Flex direction="column" align="center">
            <Touchable
              onPress={() => copyToClipboard(invitation.preview_journey_url)}
              style={{
                width: '100%',
              }}
            >
              <Flex
                style={[
                  st.bw1,
                  st.borderWhite,
                  st.br5,
                  st.bgOffBlue,
                  st.pv5,
                  {
                    paddingHorizontal: theme.spacing.s,
                  },
                ]}
              >
                <Text
                  style={[
                    st.white,
                    st.tac,
                    {
                      fontSize:
                        windowDimensions.width < 400
                          ? theme.fontSizes.l
                          : theme.fontSizes.xl,
                    },
                  ]}
                >
                  {invitation.preview_journey_url}
                </Text>
              </Flex>
            </Touchable>
            <Flex style={{ minHeight: theme.spacing.l }} />
            <OldButton
              isAndroidOpacity
              style={[
                st.pd4,
                st.br1,
                st.white,
                {
                  backgroundColor: theme.colors.white,
                  textAlign: 'center',
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowOpacity: 0.5,
                  elevation: 4,
                  shadowRadius: 5,
                  shadowOffset: {
                    width: 1,
                    height: 8,
                  },
                },
              ]}
              touchableStyle={{
                width: '100%',
              }}
              onPress={handleShare}
              testID={'ctaShareLink'}
            >
              <Text
                style={[st.fs18, st.tac, { color: theme.colors.secondary }]}
              >
                {t('shareLink')}
              </Text>
            </OldButton>
            <Flex style={{ minHeight: theme.spacing.xl }} />
            <Text style={[st.fs22, st.white]} testID={'invitationCode'}>
              {t('adventureCode:adventureCode')}:{' '}
              <Text
                style={{
                  color: theme.colors.secondary,
                  paddingLeft: 20,
                  fontFamily: theme.fonts.semiBold,
                }}
                onPress={() => copyToClipboard(invitation.code)}
              >
                {invitation.code}
              </Text>
            </Text>
            <Flex style={{ minHeight: theme.spacing.xl }} />
            <Touchable
              onPress={() => {
                modalizeSharingRef.current?.open();
              }}
            >
              <Text
                style={[
                  { color: theme.colors.white },
                  st.fs14,
                  st.tac,
                  st.ph1,
                  st.underline,
                ]}
              >
                {t('howSharingWorks')}
              </Text>
            </Touchable>
          </Flex>
        )}
      </Flex>
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalTopOffset={0}
          withHandle={false}
          openAnimationConfig={{
            timing: { duration: 300 },
          }}
          withOverlay={false}
          rootStyle={{
            elevation: 5, // need it here to solve issue with button shadow.
          }}
          modalStyle={{
            backgroundColor: 'rgba(0,0,0,.85)',
            minHeight: '105%',
            borderRadius: 0,
            marginTop: '-5%',
          }}
          FooterComponent={null}
        >
          <ModalNotifications
            closeAction={(): void => {
              modalizeRef.current?.close();
              /* navigation.navigate('AdventureName', {
                item,
                withGroup: true,
              }); */
            }}
          />
        </Modalize>
      </Portal>
      <Portal>
        <Modalize
          ref={modalizeSharingRef}
          modalTopOffset={0}
          withHandle={false}
          openAnimationConfig={{
            timing: { duration: 300 },
          }}
          withOverlay={false}
          rootStyle={{
            elevation: 5, // need it here to solve issue with button shadow.
          }}
          modalStyle={{
            backgroundColor: 'rgba(0,0,0,.85)',
            minHeight: '100%',
          }}
          FooterComponent={null}
        >
          <ModalHowSharingWorks
            closeAction={(): void => {
              modalizeSharingRef.current?.close();
              /* navigation.navigate('AdventureName', {
                item,
                withGroup: true,
              }); */
            }}
          />
        </Modalize>
      </Portal>
    </Screen>
  );
}

export default AdventureShareCode;
