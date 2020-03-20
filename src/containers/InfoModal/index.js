import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Touchable from '../../components/Touchable';
import { ScrollView, Linking } from 'react-native';
import { MONTHLY_PRICE } from '../../constants';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../../actions/auth';
import ModalBackButton from '../../components/ModalBackButton';

function InfoModal(props) {
  const dispatch = useDispatch();
  const insets = useSafeArea();

  return (
    <Flex value={1}>
      <ModalBackButton />
      <Flex style={[st.pb1, st.ph2]}>
        {true ? (
          <Flex>
            <Text style={[st.white, st.fs2, st.mt1, st.tac]}>
              You are Subscribed to TRIBL Pro
            </Text>
            <Text style={[st.normalText, st.fs5, st.tac, st.pt3]}>
              Thank you for supporting these incredible content creators!
            </Text>
          </Flex>
        ) : (
          <Flex>
            <Text style={[st.white, st.fs2, st.mt1, st.tac]}>
              Loving TRIBL?
            </Text>
            <Text style={[st.normalText, st.fs5, st.tac, st.pt3]}>
              Upgrade to TRIBL Pro and let’s keep the ball rolling! As a member,
              not only do you support these incredible content creators, you
              also stream TRIBL ad-free with access to more features like
              shuffle and repeat. Sign up for TRIBL Pro and help us keep these
              raw, moment-driven songs coming! Only {MONTHLY_PRICE}
              /month.
            </Text>
            <Touchable style={{ margin: 15 }} onPress={this.upgrade}>
              {/* <RoundButton2 style={{ fontSize: 12 }} data={'I am IN!'} /> */}
            </Touchable>
          </Flex>
        )}
      </Flex>
      <ScrollView
        bounces={false}
        style={[
          st.bgDeepBlack,
          st.f1,
          st.ph2,
          { paddingBottom: insets.bottom },
        ]}
      >
        <Text style={[st.white, st.fs2, st.tal, st.pv5]}>My Account</Text>
        <Touchable
          onPress={() => {
            // this.closeModal();
            // this.props.navigation.navigate('profile');
          }}
        >
          <Flex direction="row" align="center">
            <Text style={[st.orangeLight, st.fs2, st.pr6]}>&bull; </Text>
            <Text style={[st.normalText, st.fs3, st.pv5]}>Profile</Text>
          </Flex>
        </Touchable>

        <Touchable
          onPress={() => {
            // this.closeModal();
            // setTimeout(() => {
            //   ZendeskSupport.showHelpCenter();
            // }, 500);
          }}
        >
          <Flex direction="row" align="center">
            <Text style={[st.orangeLight, st.fs2, st.pr6]}>&bull; </Text>
            <Text style={[st.normalText, st.fs3, st.pv5]}>Help</Text>
          </Flex>
        </Touchable>

        <Touchable
          onPress={() => {
            dispatch(logoutAction());
            // this.props.dispatch(logoutAction());
          }}
        >
          <Flex direction="row" align="center">
            <Text style={[st.orangeLight, st.fs2, st.pr6]}>&bull; </Text>
            <Text style={[st.normalText, st.fs3, st.pv5]}>Logout</Text>
          </Flex>
        </Touchable>
        <Text style={[[st.white, st.fs2, st.tal, st.pv5]]}>Tribl</Text>

        <Touchable
          style={[]}
          onPress={() => {
            Linking.openURL('http://tribl.com/');
          }}
        >
          <Flex direction="row" align="center">
            <Text style={[st.orangeLight, st.fs2, st.pr6]}>&bull; </Text>
            <Text style={[st.normalText, st.fs3, st.pv5]}>Website</Text>
          </Flex>
        </Touchable>

        <Touchable
          onPress={() => {
            Linking.openURL('http://blog.tribl.com/');
          }}
        >
          <Flex direction="row" align="center">
            <Text style={[st.orangeLight, st.fs2, st.pr6]}>&bull; </Text>
            <Text style={[st.normalText, st.fs3, st.pv5]}>Blog</Text>
          </Flex>
        </Touchable>

        <Touchable
          onPress={() => {
            Linking.openURL('http://tribl.com/termsandconditions.html');
          }}
        >
          <Flex direction="row" align="center">
            <Text style={[st.orangeLight, st.fs2, st.pr6]}>&bull; </Text>
            <Text style={[st.normalText, st.fs3, st.pv5]}>
              Terms of Service
            </Text>
          </Flex>
        </Touchable>

        <Touchable
          onPress={() => {
            Linking.openURL('http://tribl.com/privacypolicy.html');
          }}
        >
          <Flex direction="row" align="center">
            <Text style={[st.orangeLight, st.fs2, st.pr6]}>&bull; </Text>
            <Text style={[st.normalText, st.fs3, st.pv5]}>Privacy Policy</Text>
          </Flex>
        </Touchable>
      </ScrollView>
    </Flex>
  );
}

export default InfoModal;
