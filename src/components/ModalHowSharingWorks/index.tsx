import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-scalable-image';

import Flex from '../Flex';
import Text from '../Text';
import st from '../../st';
import theme from '../../theme';
import OldButton from '../OldButton';
import BotTalking from '../BotTalking';
import ModalSharingCode from '../../assets/ModalSharingCode.png';
import ModalSharingLink from '../../assets/ModalSharingLink.png';
import ModalSharingNotification from '../../assets/ModalSharingNotification.png';
import ModalSharingPersonalize from '../../assets/ModalSharingPersonalize.png';

// Renders Cards on this screen https://d.pr/i/WsCCf2
function ModalHowSharingWorks({ closeAction }): React.ReactElement {
  const { t } = useTranslation('modal');

  return (
    <ScrollView bounces={false} scrollIndicatorInsets={{ right: 1 }}>
      <Flex
        style={{ justifyContent: 'space-between', width: '100%' }}
        direction="column"
        align="center"
      >
        <BotTalking
          type="overlay"
          /* heading={
                  t('howSharingWorks')
                } */
        >
          {t('howSharingWorksBotBody')}
        </BotTalking>
        <Flex value={1} style={{ marginTop: -15 }}>
          {/* <OldButton
                  isAndroidOpacity={true}
                  style={[
                    st.pd4,
                    st.bgBlue,
                    st.mb4,
                    st.br6,
                    st.w(st.fullWidth - 120),
                  ]}
                  onPress={() => primaryAction()}
                >
                  <Flex direction="row" align="center" justify="center">
                    <Text style={[st.white, st.fs20]}>{t('getStarted')}</Text>
                  </Flex>
                </OldButton> */}
          {/* <OldButton
                  isAndroidOpacity={true}
                  style={[
                    st.pd4,
                    st.mb3,
                    st.br6,
                    st.w(st.fullWidth - 120),
                    st.bw1,
                    {borderColor: "white"}
                  ]}
                  onPress={() => toggleModal()}
                >
                  <Flex direction="row" align="center" justify="center">
                    <Text style={[st.white, st.fs20]}>{t('cancel')}</Text>
                  </Flex>
                </OldButton> */}
        </Flex>
        <View style={{ minHeight: theme.spacing.xl }} />
        <Flex align="center" justify="center">
          <>
            {/* GROUP */}
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={{ marginVertical: 10, marginHorizontal: 20 }}
            >
              <Image width={130} source={ModalSharingLink} />
              <Text
                style={{
                  fontSize: 18,
                  paddingHorizontal: 25,
                  paddingVertical: 4,
                  color: 'white',
                  width: '60%',
                }}
              >
                {t('howSharingWorksLink')}
              </Text>
            </Flex>
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={{ marginTop: 20 }}
            >
              <Text
                style={{
                  fontSize: 18,
                  paddingHorizontal: 25,
                  paddingVertical: 4,
                  color: 'white',
                  width: '60%',
                }}
              >
                {t('howSharingWorksPersonalize')}
              </Text>
              <Image width={130} source={ModalSharingPersonalize} />
            </Flex>
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={{ marginTop: 20 }}
            >
              <Image width={130} source={ModalSharingNotification} />
              <Text
                style={{
                  fontSize: 18,
                  paddingHorizontal: 25,
                  paddingVertical: 4,
                  color: 'white',
                  width: '60%',
                }}
              >
                {t('howSharingWorksLetYouKnow')}
              </Text>
            </Flex>
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={{ marginTop: 20 }}
            >
              <Text
                style={{
                  fontSize: 18,
                  paddingHorizontal: 25,
                  paddingVertical: 4,
                  color: 'white',
                  width: '60%',
                }}
              >
                {t('howSharingWorksLinkAccess')}
              </Text>
              <Image width={130} source={ModalSharingCode} />
            </Flex>
          </>
          {/* <View style={{minHeight:theme.spacing.l}} /> */}
          {/* <Text style={{
                  fontSize: 20,
                  paddingHorizontal: 25,
                  paddingVertical: 25,
                  color: 'white',
                  textAlign:"center"
                  }}>{modalId === 'howDuoWorks' ?
                  t('howDuoWorksStart') :
                  t('howGroupsWorkStart')}</Text> */}
          <View style={{ minHeight: theme.spacing.xxl }} />
          <Flex>
            <OldButton
              isAndroidOpacity={true}
              style={[
                st.pd4,
                st.bgBlue,
                st.mb4,
                st.br6,
                st.w(st.fullWidth - 120),
              ]}
              onPress={() => {
                closeAction();
                // props.navigation.popToTop(); // Reset all modal of modal stacks. (this is available since 1.0.0 I think).
                // props.navigation.goBack(null) // Then close modal itself to display the main app screen nav.
              }}
            >
              <Flex direction="row" align="center" justify="center">
                <Text style={[st.white, st.fs20]}>{t('gotIt')}</Text>
              </Flex>
            </OldButton>
            <View style={{ minHeight: theme.spacing.xxl }} />
          </Flex>
        </Flex>
      </Flex>
    </ScrollView>
  );
}

export default ModalHowSharingWorks;
