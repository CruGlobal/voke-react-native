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
  VokeIcon,
} from '../../components/common';
import st from '../../st';
import {
  skipJourneyMessage,
  createJourneyMessage,
  getJourneyMessages,
  getMyJourneySteps,
  getMyJourneyStep,
} from '../../actions/journeys';
import { navigateBack } from '../../actions/nav';
import { isAndroid } from '../../constants';

const dateFormat = 'MMM D @ h:mm A';

class JourneyStepDetail extends Component {
  state = {
    journeyStep: this.props.item,
    text: '',
    viewRef: null,
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.JourneyStepDetail);
    this.setState({ viewRef: findNodeHandle(this.blurView) });
    this.getMessages();
  }

  getMessages() {
    const { dispatch, item, journey } = this.props;
    dispatch(getJourneyMessages(item, journey));
    this.load();
  }

  load = async () => {
    const { dispatch, item, journey } = this.props;
    const journeyStep = await dispatch(getMyJourneyStep(journey.id, item.id));
    this.setState({ journeyStep });
    return await dispatch(getMyJourneySteps(journey.id));
  };

  changeText = t => this.setState({ text: t });

  skip = async () => {
    const { dispatch, item, journey } = this.props;
    await dispatch(skipJourneyMessage(item, journey));
    this.getMessages();
  };

  sendMessage = async () => {
    const { dispatch, item, journey } = this.props;
    const { text } = this.state;
    if (!text) {
      return this.skip();
    }
    dispatch(createJourneyMessage(item, journey, text)).then(() => {
      this.getMessages();
    });
  };

  renderNext = () => {
    const { dispatch, steps } = this.props;
    const { journeyStep } = this.state;
    const isComplete = journeyStep.status === 'completed';
    if (!isComplete) {
      return;
    }
    // If this is the last step and it's complete, don't show this
    if ((steps[steps.length - 1] || {}).id === journeyStep.id) {
      return;
    }

    return (
      <Button
        text="Next Video is Ready"
        onPress={() => dispatch(navigateBack())}
        style={[st.bgOrange, st.mt3, st.br1, st.bw0]}
      />
    );
  };

  renderMessages() {
    const { me, messages } = this.props;
    const { journeyStep, viewRef } = this.state;
    const isComplete = journeyStep.status === 'completed';

    const reversed = [...messages]
      .reverse()
      .filter(m => m.messenger_id !== me.id); // Remove my message
    return reversed.map(m => {
      const isVoke =
        m.metadata &&
        m.metadata.vokebot_action &&
        m.metadata.vokebot_action === 'journey_step_comment';
      return (
        <Flex key={m.id} align="center" style={[st.fw100]}>
          <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
            <Flex
              ref={c => (this.blurView = c)}
              direction="column"
              style={[st.w100, st.bgDarkBlue, st.br5, st.pd5]}
            >
              <Text style={[st.fs4]}>
                {isAndroid && !isComplete ? '' : m.content}
              </Text>
              {isAndroid ? <Flex style={[st.pd4]} /> : null}
            </Flex>
            {!isComplete ? (
              <Flex
                style={[st.absfill, st.br5]}
                align="center"
                justify="center"
              >
                {/* Blur stuff doesn't work on android */}
                <BlurView
                  viewRef={viewRef}
                  blurType="dark"
                  blurAmount={3}
                  style={[st.absfill, st.br5]}
                />
                <Icon name="lock" size={40} style={[st.white]} />
              </Flex>
            ) : null}
            <Image
              source={isVoke ? VOKE_AVATAR : undefined}
              style={[
                st.absbl,
                st.left(-30),
                st.circle(25),
                st.rotate('60deg'),
              ]}
            />
          </Flex>
          <Flex direction="column" style={[st.w80]}>
            <DateComponent
              style={[st.fs6]}
              date={m.created_at}
              format={dateFormat}
            />
          </Flex>
        </Flex>
      );
    });
  }

  render() {
    const { me, messages } = this.props;
    const { journeyStep, text } = this.state;

    const inputStyle = [st.f1, st.fs4, st.darkBlue];

    const response = messages.find(i => i.messenger_id === me.id);
    const isSkipped = response && response.content === '';

    return (
      <ScrollView
        style={[st.f1]}
        contentContainerStyle={[st.bgBlue, st.minh(600)]}
        keyboardShouldPersistTaps="handled"
      >
        {journeyStep.status_message ? (
          <Flex align="center" style={[st.bgDarkBlue, st.ph1, st.pv4, st.ovh]}>
            <Text style={[st.fs4]}>{journeyStep.status_message}</Text>
            <Image
              source={VOKEBOT}
              style={[
                st.abs,
                st.left(-25),
                st.bottom(-20),
                st.circle(70),
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
                {journeyStep.question}
              </Text>
            </Flex>
            <Flex
              direction="row"
              align="center"
              style={[st.bgWhite, st.w100, st.pd4, st.brbl5, st.brbr5]}
            >
              {response ? (
                <Fragment>
                  <Text style={[inputStyle, isSkipped ? st.grey : null]}>
                    {isSkipped ? 'Skipped' : response.content}
                  </Text>
                </Fragment>
              ) : (
                <Fragment>
                  <TextInput
                    autoCapitalize="sentences"
                    returnKeyType="send"
                    multiline={true}
                    blurOnSubmit={true}
                    onSubmitEditing={this.sendMessage}
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
          {this.renderMessages()}
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

const mapStateToProps = (
  { auth, journeys },
  { navigation: { state: { params } } },
) => ({
  ...params,
  // Get messages by step id
  messages: journeys.messages[params.item.id] || [],
  me: auth.user,
  steps: journeys.steps[params.journey.id] || [],
  myJourneys: journeys.mine,
});

export default translate('journey')(
  connect(mapStateToProps)(JourneyStepDetail),
);
