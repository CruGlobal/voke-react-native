import React, { Component, Fragment } from 'react';
import { TextInput, ScrollView, Image, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { BlurView } from 'react-native-blur';

import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import { navigatePush } from '../../actions/nav';
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
    height: 50,
    newMsg: '',
  };

  async componentDidMount() {
    Analytics.screen(Analytics.s.JourneyStepDetail);
    this.getMessages();
  }

  getMessages() {
    const { dispatch, item, journey } = this.props;
    dispatch(getJourneyMessages(item, journey));
    this.load();
  }

  load = async () => {
    const { dispatch, item, journey } = this.props;

    const currentJourneyStep = await dispatch(
      getMyJourneyStep(journey.id, item.id),
    );
    this.setState({ journeyStep: currentJourneyStep });
    return await dispatch(getMyJourneySteps(journey.id));
  };

  checkIfLast = () => {
    const { t, dispatch, steps, messengers } = this.props;
    const { journeyStep } = this.state;

    // Only show "Done" if in a solo journey
    const isSolo = messengers.length === 2;
    if (isSolo && (steps[steps.length - 1] || {}).id === journeyStep.id) {
      Alert.alert(t('finishedJourney'), '', [
        {
          text: t('ok'),
          onPress: () => dispatch(navigatePush('voke.Adventures')),
        },
      ]);
    }
  };

  changeText = t => this.setState({ text: t });

  skip = async () => {
    const { dispatch, item, journey } = this.props;
    await dispatch(skipJourneyMessage(item, journey));
    this.getMessages();
    this.checkIfLast();
  };

  sendMessage = async isNewMsg => {
    const { dispatch, item, journey } = this.props;
    const { text, newMsg } = this.state;
    if (isNewMsg) {
      dispatch(createJourneyMessage(item, journey, isNewMsg)).then(() => {
        this.getMessages();
        this.checkIfLast();
      });
      return;
    }
    if (!text) {
      return this.skip();
    }
    dispatch(createJourneyMessage(item, journey, text)).then(() => {
      this.getMessages();
      this.checkIfLast();
    });
  };

  renderNext = () => {
    const { t, dispatch, steps } = this.props;
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
        text={t('nextVideoReady')}
        onPress={() => dispatch(navigateBack())}
        style={[st.bgOrange, st.mt3, st.br1, st.bw0]}
      />
    );
  };

  renderMessages() {
    const { me, messages, messengers } = this.props;
    const { journeyStep } = this.state;
    const isComplete = journeyStep.status === 'completed';

    const reversed = [...messages]
      .reverse()
      .filter(m => m.messenger_id !== me.id); // Remove my message
    return reversed.map(m => {
      const isVoke =
        m.metadata &&
        m.metadata.vokebot_action &&
        m.metadata.vokebot_action === 'journey_step_comment';
      const messenger = messengers.find(i => i.id === m.messenger_id) || {};
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
            {/* TODO: Tap to reveal */}
            {!isComplete ? (
              <Flex
                style={[st.absfill, st.br5]}
                align="center"
                justify="center"
              >
                {/* Blur stuff doesn't work on android */}
                {isAndroid ? null : (
                  <Fragment>
                    <BlurView
                      blurType="light"
                      blurAmount={2}
                      style={[st.absfill, st.br5]}
                    />
                    <Flex
                      style={[
                        st.absfill,
                        st.br5,
                        { backgroundColor: 'rgba(0,0,0,0.3)' },
                      ]}
                    />
                  </Fragment>
                )}
                <Icon name="lock" size={40} style={[st.white]} />
              </Flex>
            ) : null}
            <Image
              source={
                isVoke ? VOKE_AVATAR : { uri: (messenger.avatar || {}).small }
              }
              style={[
                st.absbl,
                st.left(-30),
                st.circle(25),
                isVoke ? st.rotate('60deg') : undefined,
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

  updateSize(height) {
    height += 10;
    this.setState({ height });
  }

  handleInputChange = text => {
    this.setState({ newMsg: text });
  };

  handleInputSizeChange = e => {
    this.updateSize(e.nativeEvent.contentSize.height);
  };

  render() {
    const { t, me, messages, messengers } = this.props;
    const { journeyStep, text, height } = this.state;

    const inputStyle = [st.f1, st.fs4, st.darkBlue];

    const response = messages.find(i => i.messenger_id === me.id);
    const isSkipped = response && response.content === '';
    const meMessenger = messengers.find(i => i.id === me.id);

    let inputHeight = {
      height: height < 45 ? 45 : height > 80 ? 80 : height,
    };

    let newWrap = {
      height: inputHeight.height + 10,
    };

    return (
      <ScrollView
        ref={c => (this.list = c)}
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
                    {isSkipped ? t('skipped') : response.content}
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
                    placeholder={t('yourAnswer')}
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
                      text={t('skip').toUpperCase()}
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
            <Image
              source={{ uri: (meMessenger.avatar || {}).small }}
              style={[st.absbr, st.right(-30), st.circle(25)]}
            />
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
        <Flex
          direction="row"
          style={[newWrap, st.w100, st.mv5, st.pv5]}
          align="center"
          justify="center"
        >
          <Flex
            direction="row"
            style={[st.pl5, st.bgDarkBlue, inputHeight]}
            align="center"
            value={1}
          >
            <Flex value={1}>
              <TextInput
                ref={c => (this.chatInput = c)}
                autoCapitalize="sentences"
                multiline={true}
                value={this.state.newMsg}
                placeholder={t('placeholder.newMessage')}
                onChangeText={this.handleInputChange}
                placeholderTextColor={st.colors.blue}
                underlineColorAndroid={st.colors.transparent}
                onContentSizeChange={this.handleInputSizeChange}
                style={[st.white, st.pv6, st.mv6, st.fs4, inputHeight]}
                autoCorrect={true}
              />
            </Flex>
            <Button
              type="transparent"
              style={[st.w(55), st.aie, st.pv6]}
              icon="send_message"
              iconType="Voke"
              iconStyle={[this.state.newMsg ? st.white : st.offBlue, st.fs2]}
              onPress={this.sendMessage(true)}
              preventTimeout={1000}
            />
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

const mapStateToProps = (
  { auth, journeys },
  { navigation: { state: { params } } },
) => ({
  ...params,
  // Get messages by step id
  messengers: params.journey.conversation.messengers || [],
  messages: journeys.messages[params.item.id] || [],
  me: auth.user,
  steps: journeys.steps[params.journey.id] || [],
  myJourneys: journeys.mine,
});

export default translate('journey')(
  connect(mapStateToProps)(JourneyStepDetail),
);
