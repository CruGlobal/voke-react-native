import React, { Component, Fragment } from 'react';
import {
  Keyboard,
  TextInput,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import { BlurView } from 'react-native-blur';

import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import { navigatePush } from '../../actions/nav';
import { createMessageInteraction } from '../../actions/messages';
import VOKEBOT from '../../../images/vokebot_whole.png';

import {
  Flex,
  Text,
  Button,
  Icon,
  DateComponent,
  Avatar,
  VokeIcon,
} from '../../components/common';
import st from '../../st';
import {
  skipJourneyMessage,
  createJourneyMessage,
  getJourneyMessages,
  getMyJourneySteps,
  getMyJourneyStep,
  getMyJourneys,
} from '../../actions/journeys';
import { navigateBack } from '../../actions/nav';
import { isAndroid } from '../../constants';
import theme from '../../theme';

const dateFormat = 'MMM D @ h:mm A';

class JourneyStepDetail extends Component {
  state = {
    text: '',
    height: 50,
    newMsg: '',
    stateResponse: null,
    isResponseSet: false,
  };

  async componentDidMount() {
    Analytics.screen(Analytics.s.JourneyStepDetail);
    this.getMessages();
  }

  // componentDidUpdate(prevProps) {
  //   // Update status message when it changes in props
  //   const { journeyStepItem } = this.props;
  //   if (prevProps.journeyStepItem.status_message !== journeyStepItem.status_message || prevProps.journeyStepItem.status !== journeyStepItem.status) {
  //     this.setState({
  //       journeyStep: {
  //         ...this.state.journeyStep,
  //         status_message: journeyStepItem.status_message,
  //       },
  //     });
  //   }
  // }

  async createMessageReadInteraction(msg) {
    if (!msg) {
      return;
    }
    const { dispatch, journey } = this.props;

    const interaction = {
      action: 'read',
      conversationId: journey.conversation.id,
      messageId: msg.id,
    };

    await dispatch(createMessageInteraction(interaction));
    await dispatch(getMyJourneys());
  }

  getMessages() {
    const { dispatch, journeyStep, journey, scrollToEnd } = this.props;
    dispatch(getJourneyMessages(journeyStep, journey)).then(() => {
      this.createMessageReadInteraction(this.props.messages[0]);
      if (this.props.messages.length > 1) {
        scrollToEnd();
      }
    });
    this.load();
  }

  load = async () => {
    const { dispatch, journeyStep, journey } = this.props;

    await dispatch(getMyJourneyStep(journey.id, journeyStep.id));
    // const currentJourneyStep = await dispatch(
    //   getMyJourneyStep(journey.id, journeyStep.id),
    // );
    // this.setState({ journeyStep: currentJourneyStep });
    return await dispatch(getMyJourneySteps(journey.id));
  };

  checkIfLast = () => {
    const { t, dispatch, steps, messengers, journeyStep } = this.props;

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
    const { dispatch, journeyStep, journey, scrollToEnd } = this.props;
    try {
      this.setState({
        isSending: true,
        stateResponse: { content: '', created_at: new Date() },
      });
      await dispatch(skipJourneyMessage(journeyStep, journey));
      this.getMessages();
      this.checkIfLast();
      this.setState({ isSending: false });
    } catch (error) {
      this.setState({ isSending: false, stateResponse: null });
    }
  };

  sendMessage = async isNewMsg => {
    const { dispatch, journeyStep, journey } = this.props;
    const { text, newMsg, isSending } = this.state;
    Keyboard.dismiss();
    if (isSending) {
      return null;
    }
    if (isNewMsg) {
      if (!newMsg) {
        return null;
      }
      try {
        this.setState({ isSending: true });
        await dispatch(createJourneyMessage(journeyStep, journey, newMsg));
        this.getMessages();
        this.setState({ isSending: false, newMsg: '' });
        this.chatInput.blur();
        this.chatInput.clear();
        return;
      } catch (error) {
        this.setState({ isSending: false });
      }
    }
    if (!text) {
      return this.skip();
    }
    try {
      this.setState({
        isSending: true,
        stateResponse: { content: text, created_at: new Date() },
      });
      await dispatch(createJourneyMessage(journeyStep, journey, text));
      this.getMessages();
      this.checkIfLast();
      this.setState({ isSending: false });
    } catch (error) {
      this.setState({ isSending: false, stateResponse: null });
    }
  };

  renderNext = () => {
    const {
      t,
      dispatch,
      me,
      steps,
      journey,
      journeyStep,
      messengers,
    } = this.props;
    const isComplete = journeyStep.status === 'completed';
    const isWaiting =
      journeyStep.status === 'active' && journeyStep['completed_by_messenger?'];
    if (!isComplete && !isWaiting) {
      return;
    }
    // If this is the last step and it's complete, don't show this
    if ((steps[steps.length - 1] || {}).id === journeyStep.id) {
      return;
    }

    const isSolo = messengers.length === 2;
    if (isSolo) {
      return;
    }

    let text = t('nextVideoReady');
    if (isWaiting) {
      const otherUser = journey.conversation.messengers.find(
        i => i.id !== me.id && i.first_name !== 'VokeBot',
      );
      // TODO: Pass through invite name
      // if (journey.conversation.messengers.length === 2 && inviteName) {
      //   otherUser = { first_name: inviteName };
      // }
      text = t('waitingForAnswer', { name: (otherUser || {}).first_name });
    }

    return (
      <Button
        text={text}
        onPress={() => dispatch(navigateBack())}
        style={[st.bgOrange, st.mt3, st.br1, st.bw0]}
      />
    );
  };

  renderMessages() {
    const { me, messages, messengers, journeyStep } = this.props;
    const { stateResponse } = this.state;

    let reversed = [...messages].reverse();
    // Keep track of internal state and use that if it exists, otherwise find it in the messages
    const response =
      stateResponse || reversed.find(i => i.messenger_id === me.id);
    const isSkipped = response && response.content === '';

    const isComplete = journeyStep.status === 'completed';

    const myFirstMessage = reversed.find(m => m.messenger_id === me.id);
    if (myFirstMessage && myFirstMessage.id) {
      reversed = reversed.filter(m => m.id !== myFirstMessage.id);
    }
    return reversed.map(m => {
      const isVoke =
        m.metadata &&
        m.metadata.vokebot_action &&
        m.metadata.vokebot_action === 'journey_step_comment';
      const isMine = m.messenger_id === me.id;
      const messenger = messengers.find(i => i.id === m.messenger_id) || {};
      const isBlur = (!isComplete && !isMine) || (isSkipped && !isMine);
      return (
        <Flex key={m.id} align="center" style={[st.fw100]}>
          <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
            <Flex ref={c => (this.blurView = c)} direction="row">
              {isMine ? <Flex style={[st.f1]} /> : null}
              <Flex
                direction="column"
                style={[
                  isBlur || isMine ? st.bgDarkBlue : st.bgWhite,
                  st.br5,
                  st.pd5,
                  st.w100,
                ]}
              >
                {isAndroid && isBlur ? (
                  <Flex style={[st.pd4, st.f1, st.w100]} />
                ) : (
                  <Fragment>
                    <Text
                      style={[st.fs4, isBlur || isMine ? st.white : st.blue]}
                    >
                      {isAndroid && isBlur ? '' : m.content}
                    </Text>
                    {isAndroid && isBlur ? <Flex style={[st.pd4]} /> : null}
                  </Fragment>
                )}
              </Flex>
              {!isMine ? <Flex style={[st.f1]} /> : null}
            </Flex>

            {/* TODO: Tap to reveal */}
            {isBlur ? (
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
            <Avatar
              image={(messenger.avatar || {}).small}
              isVoke={isVoke}
              size={25}
              style={[st.absb, isMine ? st.right(-30) : st.left(-30)]}
            />
          </Flex>
          <Flex direction="column" style={[st.w80]}>
            <DateComponent
              style={[st.fs6, isMine ? st.tar : null]}
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
    this.setMessageBox();
  };

  handleInputSizeChange = e => {
    this.updateSize(e.nativeEvent.contentSize.height);
  };

  setMessageBox = () => {
    const { t, setCustomRender } = this.props;
    const { height } = this.state;

    let inputHeight = {
      height: height < 45 ? 45 : height > 80 ? 80 : height,
    };

    let newWrap = {
      height: inputHeight.height,
    };
    // This needs to be wrapped in it's own <KeyboardAvoidingView>
    setCustomRender(
      <KeyboardAvoidingView
        style={[st.bgBlue, isAndroid ? [st.w100, st.absblr] : null]}
        behavior={theme.isAndroid ? undefined : 'padding'}
        keyboardVerticalOffset={
          theme.isAndroid ? undefined : st.hasNotch ? 45 : 20
        }
      >
        <Flex
          direction="row"
          style={[newWrap, st.w100, !isAndroid ? st.absblr : null]}
          align="center"
          justify="center"
        >
          <Flex
            direction="row"
            style={[st.pl5, st.bgDarkBlue, inputHeight]}
            align="center"
            value={1}
          >
            {/* THIS SHOULD NOT BE A CONTROLLED COMPONENT BECAUSE IT'S BEING RENDERED ON THE PARENT COMPONENT */}
            <TextInput
              ref={c => (this.chatInput = c)}
              autoCapitalize="sentences"
              multiline={false}
              returnKeyType="done"
              placeholder={t('placeholder.newMessage')}
              onChangeText={this.handleInputChange}
              placeholderTextColor={st.colors.blue}
              underlineColorAndroid={st.colors.transparent}
              onContentSizeChange={this.handleInputSizeChange}
              style={[st.f1, st.white, st.pv6, st.mv6, st.fs4, inputHeight]}
              selectionColor={st.colors.yellow}
              autoCorrect={true}
            />
            <Button
              type="transparent"
              style={[st.w(55), st.aie, st.pv6]}
              icon="send_message"
              iconType="Voke"
              iconStyle={[st.white, st.fs2]}
              onPress={() => this.sendMessage(true)}
              preventTimeout={3000}
            />
            {/* iconStyle={[newMsg ? st.white : st.offBlue, st.fs2]} */}
          </Flex>
        </Flex>
      </KeyboardAvoidingView>,
    );
  };

  render() {
    const { t, me, messages, messengers, journeyStep } = this.props;
    const { text, stateResponse, isResponseSet } = this.state;

    const inputStyle = [st.f1, st.fs4, st.darkBlue];

    const reversed = [...messages].reverse();
    // Keep track of internal state and use that if it exists, otherwise find it in the messages
    const response =
      stateResponse || reversed.find(i => i.messenger_id === me.id);
    const isSkipped = response && response.content === '';
    if (response && !isResponseSet) {
      this.setState({ isResponseSet: true });
      this.setMessageBox();
    }
    const meMessenger = messengers.find(i => i.id === me.id);

    return (
      <ScrollView
        ref={c => (this.list = c)}
        style={[st.f1]}
        contentContainerStyle={[st.bgBlue, st.pb(70)]}
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
                    onSubmitEditing={() => this.sendMessage()}
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
                    <Button
                      type="transparent"
                      onPress={() => this.sendMessage()}
                    >
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
            <Avatar
              image={(meMessenger.avatar || {}).small}
              size={25}
              style={[st.absb, st.right(-30)]}
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
  journeyStep:
    (journeys.steps[params.journey.id] || []).find(
      i => i.id === params.item.id,
    ) || params.item,
  me: auth.user,
  steps: journeys.steps[params.journey.id] || [],
  myJourneys: journeys.mine,
});

export default translate('journey')(
  connect(mapStateToProps)(JourneyStepDetail),
);
