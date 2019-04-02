import React, { Component, Fragment } from 'react';
import { findNodeHandle, TextInput, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';
import { BlurView } from 'react-native-blur';

import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import VOKEBOT from '../../../images/vokebot_whole.png';
import VOKE_AVATAR from '../../../images/voke_avatar_small.png';

import {
  Flex,
  Text,
  Button,
  Icon,
  DateComponent,
} from '../../components/common';
import st from '../../st';
import {
  skipJourneyMessage,
  createJourneyMessage,
  getJourneyMessages,
  getMyJourneySteps,
} from '../../actions/journeys';
import { navigateBack } from '../../actions/nav';

const dateFormat = 'MMM D @ h:mm A';

class JourneyStepDetail extends Component {
  state = {
    text: '',
    viewRef: null,
    disabledInput: false,
    messages: [],
    completed: false,
  };

  componentDidMount() {
    console.log('HERER');
    Analytics.screen(Analytics.s.JourneyStepDetail);
    this.setState({ viewRef: findNodeHandle(this.blurView) });
    this.getMessages();
  }

  async getMessages() {
    const { dispatch, item, journey } = this.props;
    const { messages = [] } = await dispatch(getJourneyMessages(item, journey));
    console.log('messages', messages);
    this.setState({ messages }, () => {
      this.setState({ viewRef: findNodeHandle(this.blurView) });
    });
    if (messages.length > 1) {
      this.setState({ disabledInput: true });
    }
  }

  load = async () => {
    const { dispatch, journey } = this.props;
    const results = await dispatch(getMyJourneySteps(journey.id));
    return results;
  };

  changeText = t => this.setState({ text: t });

  skip = async () => {
    const { dispatch, item, journey } = this.props;
    await dispatch(skipJourneyMessage(item, journey));
    this.getMessages();
    this.setState({ completed: true });
  };

  sendMessage = async () => {
    const { dispatch, item, journey } = this.props;
    const { text } = this.state;
    if (!text) {
      return this.skip();
    }
    dispatch(createJourneyMessage(item, journey, text)).then(() => {
      this.getMessages();
      this.setState({ completed: true });
    });
  };

  renderNext = () => {
    const { item } = this.props;
    const { completed } = this.state;
    const isComplete = item['completed_by_messenger?'] || completed;
    if (!isComplete) return;
    return (
      <Button
        text="Next Video is Ready"
        onPress={() => {
          this.load().then(() => this.props.dispatch(navigateBack()));
        }}
        style={[st.bgOrange, st.mt3, st.br1, st.bw0]}
      />
    );
  };

  renderMessage() {
    const { item } = this.props;
    const { viewRef, messages, completed } = this.state;
    const isComplete = item['completed_by_messenger?'] || completed;

    const message = messages.find(
      i =>
        i.metadata &&
        i.metadata.vokebot_action &&
        i.metadata.vokebot_action === 'journey_step_comment',
    );
    console.log('MEEMSMSM', message, messages);
    if (!message) {
      return null;
    }
    return (
      <Fragment>
        <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
          <Flex
            ref={c => (this.blurView = c)}
            direction="column"
            style={[st.w100, st.bgDarkBlue, st.br5, st.pd5]}
          >
            <Text style={[st.fs4]}>{message.content}</Text>
          </Flex>
          {!isComplete ? (
            <Flex style={[st.absfill, st.br5]} align="center" justify="center">
              <BlurView
                viewRef={viewRef}
                blurType="dark"
                blurAmount={10}
                style={[st.absfill]}
              />
              <Icon name={'lock'} size={40} style={[st.white]} />
            </Flex>
          ) : null}
          <Image
            source={VOKE_AVATAR}
            style={[
              st.absbl,
              st.left(-30),
              st.w(25),
              st.h(25),
              st.rotate('60deg'),
            ]}
          />
        </Flex>
        <Flex direction="column" style={[st.w80]}>
          <DateComponent
            style={[st.fs6]}
            date={message.created_at}
            format={dateFormat}
          />
        </Flex>
      </Fragment>
    );
  }

  render() {
    const { item, me, myJourneys } = this.props;
    const { text, disabledInput, messages } = this.state;
    const isComplete = item['completed_by_messenger?'];

    const showFirstVokeMessage = item.position === 1;
    // This is used to determine which hardcoded vokebot message we display at the top of the page
    const hideOtherVokeOnboarding = myJourneys > 1;

    const inputStyle = [st.f1, st.fs4, st.darkBlue];

    const response = messages.find(i => i.messenger_id === me.id);
    if (response === '') {
      response === 'Skipped';
    }

    return (
      <ScrollView contentContainerStyle={[st.f1, st.bgBlue, st.minh(600)]}>
        {!isComplete || hideOtherVokeOnboarding ? (
          <Flex align="center" style={[st.bgDarkBlue, st.ph1, st.pv4, st.ovh]}>
            <Text style={[st.fs4]}>
              {showFirstVokeMessage
                ? `Hi ${
                    me.first_name
                  }! Watch the video then answer the question to unlock other people's answers!`
                : `You are making great progress ${
                    me.first_name
                  }! I see you are getting the hang of it!`}
            </Text>
            <Image
              source={VOKEBOT}
              style={[
                st.abs,
                st.left(-25),
                st.bottom(-20),
                st.w(70),
                st.h(70),
                st.rotate('40deg'),
              ]}
            />
          </Flex>
        ) : null}
        <Flex value={1} align="center" style={[st.bgBlue]}>
          <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
            <Flex
              direction="column"
              style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
              align="center"
              justify="center"
            >
              <Text style={[st.tac, st.fs(20), st.lh(24)]}>
                {item.question}
              </Text>
            </Flex>
            <Flex
              direction="row"
              align="center"
              style={[st.bgWhite, st.w100, st.pd4, st.brbl5, st.brbr5]}
            >
              {disabledInput && response ? (
                <Fragment>
                  <Text style={inputStyle}>{response.content}</Text>
                </Fragment>
              ) : (
                <Fragment>
                  <TextInput
                    autoCapitalize="sentences"
                    returnKeyType="done"
                    multiline={true}
                    blurOnSubmit={true}
                    disabled={disabledInput}
                    placeholder="Your Answer..."
                    placeholderTextColor={st.colors.grey}
                    style={inputStyle}
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
                </Fragment>
              )}
            </Flex>
          </Flex>
          {response ? (
            <Flex direction="column" style={[st.w80]}>
              <DateComponent
                style={[st.fs6, st.tar]}
                date={response.created_at}
                format={dateFormat}
              />
            </Flex>
          ) : null}
          {this.renderMessage()}
          {this.renderNext()}
        </Flex>
      </ScrollView>
    );
  }
}

JourneyStepDetail.propTypes = {
  item: PropTypes.object.isRequired,
  onPause: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, journeys }, { navigation }) => ({
  ...navigation.state.params,
  me: auth.user,
  myJourneys: journeys.mine,
});

export default translate('journey')(
  connect(mapStateToProps)(JourneyStepDetail),
);
