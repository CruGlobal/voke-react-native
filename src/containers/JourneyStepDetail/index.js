import React, { Component } from 'react';
import { findNodeHandle, TextInput, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';
import { BlurView } from 'react-native-blur';

import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import VOKEBOT from '../../../images/vokebot_whole.png';
import VOKE_AVATAR from '../../../images/voke_avatar_small.png';

import { Flex, Text, Button, VokeIcon } from '../../components/common';
import st from '../../st';
import {
  skipJourneyMessage,
  createJourneyMessage,
  getJourneyMessages,
} from '../../actions/journeys';

class JourneyStepDetail extends Component {
  state = { text: '', viewRef: null, shouldBlur: true };

  async componentDidMount() {
    Analytics.screen(Analytics.s.JourneyStepDetail);
    this.setState({ viewRef: findNodeHandle(this.blurView) });
    const { dispatch, item, journey } = this.props;
    const { messages = [] } = await dispatch(getJourneyMessages(item, journey));
  }

  changeText = t => this.setState({ text: t });

  skip = () => {
    const { dispatch, item, journey } = this.props;
    dispatch(skipJourneyMessage(item, journey));
  };

  sendMessage = () => {
    const { dispatch, item, journey } = this.props;
    const { text } = this.state;
    if (!text) {
      return this.skip();
    }
    dispatch(createJourneyMessage(item, journey, text));
  };

  render() {
    const { item, me } = this.props;
    const { text, viewRef, shouldBlur } = this.state;

    return (
      <ScrollView contentContainerStyle={[st.f1, st.bgBlue, st.minh(600)]}>
        <Flex align="center" style={[st.bgDarkBlue, st.ph1, st.pv4, st.ovh]}>
          <Text style={[st.fs4]}>
            Hi {me.first_name}! Watch the video then answer the question to
            unlock other people's answers!
          </Text>
          <Image
            source={VOKEBOT}
            style={[
              st.absbl,
              st.w(70),
              st.h(70),
              { left: -25, bottom: -20, transform: [{ rotate: '40deg' }] },
            ]}
          />
        </Flex>
        <Flex value={1} align="center" style={[st.bgBlue]}>
          <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
            <Flex
              direction="column"
              style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
              align="center"
              justify="center"
            >
              <Text style={[st.tac, st.fs(20), { lineHeight: 24 }]}>
                {item.question}
              </Text>
            </Flex>
            <Flex
              direction="row"
              align="center"
              style={[st.bgWhite, st.w100, st.pd4, st.brbl5, st.brbr5]}
            >
              <TextInput
                autoCapitalize="sentences"
                returnKeyType="done"
                multiline={true}
                blurOnSubmit={true}
                placeholder="Your Answer..."
                placeholderTextColor={st.colors.grey}
                style={[st.f1, st.fs4, st.darkBlue]}
                underlineColorAndroid={st.colors.transparent}
                selectionColor={st.colors.darkBlue}
                value={text}
                onChangeText={this.changeText}
              />
              {!text ? (
                <Button
                  type="transparent"
                  onPress={this.skip}
                  text="SKIP"
                  buttonTextStyle={[st.orange, st.bold, st.fs4, st.ls2]}
                />
              ) : (
                <Button type="transparent" onPress={this.sendMessage}>
                  <VokeIcon
                    name="send_message"
                    size={20}
                    style={[st.offBlue]}
                  />
                </Button>
              )}
            </Flex>
          </Flex>
          <Flex direction="column" style={[st.w80]}>
            <Text style={[st.fs6, st.tar]}>9:20 PM</Text>
          </Flex>
          <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
            <Flex
              ref={c => (this.blurView = c)}
              direction="column"
              style={[st.w100, st.bgDarkBlue, st.br5, st.pd5]}
            >
              <Text style={[st.fs4]}>
                Sharon responded: 'I really liked how he said the question of
                HOW always leads to the question of WHO.'
              </Text>
            </Flex>
            {shouldBlur ? (
              <Flex
                style={[st.absfill, st.br5]}
                align="center"
                justify="center"
              >
                <BlurView
                  viewRef={viewRef}
                  blurType="dark"
                  blurAmount={3}
                  style={[st.absfill, st.br5]}
                />
                <VokeIcon name="play" size={40} />
              </Flex>
            ) : null}
            <Image
              source={VOKE_AVATAR}
              style={[
                st.absbl,
                st.w(25),
                st.h(25),
                { left: -30, transform: [{ rotate: '60deg' }] },
              ]}
            />
          </Flex>
          <Flex direction="column" style={[st.w80]}>
            <Text style={[st.fs6]}>9:20 PM</Text>
          </Flex>
        </Flex>
      </ScrollView>
    );
  }
}

JourneyStepDetail.propTypes = {
  item: PropTypes.object.isRequired,
  onPause: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  me: auth.user,
});

export default translate('journey')(
  connect(mapStateToProps)(JourneyStepDetail),
);
