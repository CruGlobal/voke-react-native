import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { RootState } from '../../reducers';
import { useNavigation } from '@react-navigation/native';
import Clipboard from "@react-native-community/clipboard";
import { useTranslation } from "react-i18next";
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import st from '../../st';
import theme from '../../theme';
import Button from '../../components/Button';
import { useFocusEffect } from '@react-navigation/native';
// import { MONTHLY_PRICE } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { Share, ScrollView } from 'react-native';

import BotTalking from '../../components/BotTalking';
import Touchable from '../../components/Touchable';
import { toastAction } from '../../actions/info';
import CONSTANTS, { REDUX_ACTIONS } from '../../constants';
import { useHeaderHeight } from '@react-navigation/stack';

function AdventureShareCode(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation('share');
  const { pushNotificationPermission } = useSelector(({ info }: RootState) => info);
  const [askedNotifications, setAskedNotifications] = useState(false);
  const { invitation, withGroup, isVideoInvite } = props.route.params;
  const headerHeight = useHeaderHeight();
  let popupTimeout = null;

  const handleShare = () => {
    Share.share(
      {
        message: isVideoInvite
          ? t(
            'share:shareMessageVideo', {
              friend: ' ' + invitation?.first_name,
              link: invitation.url,
            })
          : t(
            'share:shareMessage', {
              friend: withGroup ? '': ' ' + invitation?.name,
              link: invitation?.preview_journey_url,
              code: invitation?.code
            })
          // {t('downloadMessage')}`Download Voke and join my ${invitation.name} Adventure. Use code: ${invitation.code} ${CONSTANTS.APP_URL}`,
      },
      {
        dialogTitle: t('share'),
      },
    ).catch(err => console.log('Share Error', err));
  }

  const copyToClipboard = (value) => {
    Clipboard.setString(value);
    dispatch(toastAction( t('copied'), 'short' ));
  };

  const askNotificationPermissions = () => {
    if ( !askedNotifications ) {
        setAskedNotifications(true);
        if ( pushNotificationPermission !== 'granted') {
          navigation.navigate( 'CustomModal',{ modalId: 'notifications' })
        }
      }
  };

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      // When the screen is focused:
      // Ask for notifications permissions.
      popupTimeout = setTimeout(() => askNotificationPermissions() , 600);
      return (): void => {
        // When the screen is unfocused:
        clearTimeout(popupTimeout);
      };
    })
  );

  return (
    <Flex
      direction="column"
      justify="center"
      style={[st.w100, st.h100, st.bgBlue, { paddingTop: insets.top }]}
    >
      <StatusBar />
      <ScrollView contentContainerStyle={{
        height: '100%',
        justifyContent: 'center',
      }}>
        <Flex style={{minHeight:headerHeight||0}} />
        {/* Extra space to compensate for header */}
        <Flex
          direction="column"
          align="center"
          justify="center"
        >
          <BotTalking>
            { withGroup ?
                t('share:groupPreviewLinkReady', {name:invitation.name}) :
                isVideoInvite ?
                  t('share:linkReady') :
                  t('share:previewLinkReady', {name:invitation.name})}
          </BotTalking>
        </Flex>
        <Flex style={{minHeight:theme.spacing.xs}} />
        { isVideoInvite &&
          <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
            <Text style={[st.fs22, st.white, st.pb4]}>{t('inviteLink')}: </Text>
            <Touchable onPress={()=>copyToClipboard(invitation.url)}>
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
                st.w(st.fullWidth - 70),{backgroundColor: theme.colors.white, textAlign:"center",shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.5,
                elevation: 4,
                shadowRadius: 5 ,
                shadowOffset : { width: 1, height: 8}}
              ]}
              onPress={handleShare}
            >
              <Text style={[st.fs20, st.tac, {color:theme.colors.secondary}]}>{t('share')}</Text>
            </Button>
          </Flex>
        }
        { !isVideoInvite &&
          <Flex direction="column" align="center"
            style={[
              st.ph1,
              st.w100,
            ]}
          >
            <Touchable onPress={()=>copyToClipboard(invitation.preview_journey_url)}
              style={{
                width:'100%',
              }}
            >
              <Flex
                style={[
                  st.bw1,
                  st.borderWhite,
                  st.br5,
                  st.bgOffBlue,
                  st.pv5,
                  // st.ph5,
                  {
                    paddingHorizontal: theme.spacing.s
                  }
                ]}
              >
                <Text style={[
                  st.white,
                  st.tac,
                  {
                    fontSize: 19,
                  }]}
                >
                  {invitation.preview_journey_url}
                </Text>
              </Flex>
            </Touchable>
            <Flex style={{minHeight:theme.spacing.l}} />
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
                  shadowOffset : {
                    width: 1,
                    height: 8
                  }
                }
              ]}
              touchableStyle = {{
                width:'100%',
              }}
              onPress={handleShare}
            >
              <Text style={[st.fs18, st.tac, {color:theme.colors.secondary}]}>{t('shareLink')}</Text>
            </Button>
            <Flex style={{minHeight:theme.spacing.xl}} />
            <Text style={[st.fs22, st.white]}>
              {t('adventureCode:adventureCode')}:{' '}
                <Text
                  style={{
                    color:theme.colors.secondary,
                    paddingLeft: 20,
                    fontFamily: theme.fonts.semiBold
                  }}
                  onPress={()=>copyToClipboard(invitation.code)}
                >{invitation.code}</Text>
            </Text>
            <Flex style={{minHeight:theme.spacing.xl}} />
            <Touchable onPress={
                  () => {
                    const navState=navigation.dangerouslyGetState()
                    navigation.navigate( 'CustomModal',
                      {
                        modalId: 'howSharingWorks',
                        primaryAction: () => {},
                    })
                  }}>
              <Text style={[{color:theme.colors.white}, st.fs14, st.tac, st.ph1, st.underline]}>
                {t('howSharingWorks')}
              </Text>
            </Touchable>
          </Flex>
        }
        <Flex style={{minHeight:insets.bottom + theme.spacing.xxl}} />
      </ScrollView>
    </Flex>
  );
}

export default AdventureShareCode;
