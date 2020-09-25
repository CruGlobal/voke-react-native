import React, { useState, useEffect, useRef } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Share, ScrollView, Dimensions } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

import ModalNotifications from '../../components/ModalNotifications';
import { RootState } from '../../reducers';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import StatusBar from '../../components/StatusBar';
import st from '../../st';
import theme from '../../theme';
import Button from '../../components/Button';
import BotTalking from '../../components/BotTalking';
import Touchable from '../../components/Touchable';
import { toastAction } from '../../actions/info';

function AdventureShareCode(props) {
  const modalizeRef = useRef<Modalize>(null);
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation('share');
  const { pushNotificationPermission } = useSelector(
    ({ info }: RootState) => info,
  );
  const askedNotifications = useRef(false);
  const { invitation, withGroup, isVideoInvite } = props.route.params;
  const headerHeight = useHeaderHeight();
  const windowDimensions = Dimensions.get('window');
  const [modalId, setModalId] = useState(null);
  let popupTimeout = null;

  const handleShare = () => {
    Share.share(
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
      {
        dialogTitle: t('share'),
      },
    ).catch(err => console.log('Share Error', err));
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        // flex: 1,
        minHeight: '100%',
        flexDirection: 'column',
        alignContent: 'stretch',
        justifyContent: 'flex-end',
        backgroundColor: theme.colors.primary,
      }}
    >
      <StatusBar />
      <Flex style={{ minHeight: headerHeight || 0 }} />
      {/* Extra space to compensate for header */}
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
        <Flex
          direction="column"
          align="center"
          style={{
            paddingHorizontal: theme.spacing.l,
          }}
        >
          <Text style={[st.fs22, st.white, st.pb4]}>{t('inviteLink')}: </Text>
          <Touchable onPress={() => copyToClipboard(invitation.url)}>
            <Flex
              style={[
                st.bw1,
                st.borderWhite,
                st.br5,
                st.bgOffBlue,
                st.pv5,
                st.ph2,
              ]}
            >
              <Text style={[st.white, st.fs24]}>
                {isVideoInvite ? invitation.url : invitation.code}
              </Text>
            </Flex>
          </Touchable>
          <Button
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
            <Text style={[st.fs20, st.tac, { color: theme.colors.secondary }]}>
              {t('share')}
            </Text>
          </Button>
          <Flex style={{ minHeight: theme.spacing.xl }} />
        </Flex>
      )}
      {!isVideoInvite && (
        <Flex
          direction="column"
          align="center"
          style={{
            paddingHorizontal: theme.spacing.l,
          }}
        >
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
          <Button
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
            <Text style={[st.fs18, st.tac, { color: theme.colors.secondary }]}>
              {t('shareLink')}
            </Text>
          </Button>
          <Flex style={{ minHeight: theme.spacing.xl }} />
          <Text style={[st.fs22, st.white]} testID={'textAdventureCode'}>
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
              const navState = navigation.dangerouslyGetState();
              setModalId('howSharingWorks');
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
      <Flex style={{ minHeight: insets.bottom + theme.spacing.xxl }} />
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalTopOffset={0}
          withHandle={false}
          openAnimationConfig={{
            timing: { duration: 300 },
          }}
          withOverlay={false}
          modalStyle={{
            backgroundColor: 'rgba(0,0,0,.85)',
            minHeight: '100%',
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
    </ScrollView>
  );
}

export default AdventureShareCode;
