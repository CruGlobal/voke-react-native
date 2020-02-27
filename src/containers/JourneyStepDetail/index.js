import React, { Component, Fragment } from 'react';
import DeviceInfo from 'react-native-device-info';
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
import { SET_OVERLAY } from '../../constants';

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
  createJourneyMessageFromMessage,
  getJourneyMessages,
  getMyJourneySteps,
  getMyJourneyStep,
  getMyJourneys,
} from '../../actions/journeys';
import { navigateBack } from '../../actions/nav';
import { isAndroid } from '../../constants';
import theme from '../../theme';
import Select from '../../components/Select';

const dateFormat = 'MMM D @ h:mm A';

class JourneyStepDetail extends Component {
  constructor(props) {
    super(props);

    const selectedAnswer = (
      ((props.journeyStep || {}).metadata || {}).answers || []
    ).find(i => i.selected);

    this.state = {
      text: '',
      text2: '',
      height: 50,
      newMsg: '',
      stateResponse: null,
      stateResponse2: null,
      isResponseSet: false,
      isResponseSet2: false,
      multiChoiceAnswer: (selectedAnswer || {}).value || null,
      otherMultiChoiceAnswers: {},
    };
  }

  async componentDidMount() {
    Analytics.screen(Analytics.s.JourneyStepDetail);
    this.getMessages();
  }

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
    const { t, dispatch, steps, journeyStep, journey } = this.props;

    // Only show "Done" if in a solo journey
    const isSolo = journey && journey.kind !== 'duo';
    // if (isSolo && (steps[steps.length - 1] || {}).id === journeyStep.id) {
    //   Alert.alert(t('finishedJourney'), '', [
    //     {
    //       text: t('ok'),
    //       onPress: () => dispatch(navigatePush('voke.Adventures')),
    //     },
    //   ]);
    // }
  };

  changeText = t => this.setState({ text: t });
  changeText2 = t => this.setState({ text2: t });

  skip = async subChallengeId => {
    const { dispatch, journeyStep, journey } = this.props;
    try {
      this.setState({
        isSending: true,
        stateResponse: { content: '', created_at: new Date() },
      });
      await dispatch(
        skipJourneyMessage(
          subChallengeId ? { id: subChallengeId } : journeyStep,
          journey,
        ),
      );
      this.getMessages();
      this.checkIfLast();
      this.setState({ isSending: false });
    } catch (error) {
      this.setState({ isSending: false, stateResponse: null });
    }
  };

  friend = () => {
    const { dispatch, journey } = this.props;
    try {
      dispatch(
        navigatePush('voke.ShareEnterName', {
          item: { ...journey, id: journey.organization_journey_id },
        }),
      );
    } catch {}
  };

  group = async () => {
    const { dispatch, journey } = this.props;
    try {
      dispatch(
        navigatePush('voke.ShareEnterName', {
          item: { ...journey, id: journey.organization_journey_id },
          isGroup: true,
        }),
      );
    } catch {}
  };

  sendMessage = async (
    isNewMsg,
    isMulti,
    istMultiFromMulti,
    isQuestionFromMulti,
    stepId,
    messageId,
    answerFromMultiChoice,
  ) => {
    const { dispatch, journeyStep, journey, isAnonUser } = this.props;
    const { text, newMsg, isSending, multiChoiceAnswer, text2 } = this.state;
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
    if (isMulti) {
      if (!multiChoiceAnswer) return;
      this.setState({
        isSending: true,
      });
      await dispatch(
        createJourneyMessage(journeyStep, journey, null, multiChoiceAnswer),
      );
      this.getMessages();
      this.checkIfLast();
      this.setState({ isSending: false });
    }
    if (istMultiFromMulti) {
      if (!answerFromMultiChoice) return;
      this.setState({
        isSending: true,
      });
      await dispatch(
        createJourneyMessageFromMessage(
          stepId,
          journey,
          null,
          answerFromMultiChoice,
          messageId,
        ),
      );
      this.getMessages();
      this.checkIfLast();
      this.setState({ isSending: false });
    }
    if (isQuestionFromMulti) {
      if (!text2) {
        return this.skip();
      }
      this.setState({
        isSending: true,
        stateResponse2: { content: text2, created_at: new Date() },
      });
      await dispatch(
        createJourneyMessage(stepId, journey, text2, null, messageId),
      );
      this.getMessages();
      this.checkIfLast();
      this.setState({ isSending: false });
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
      // show save progress if third step
      if (journeyStep.position === 3) {
        if (isAnonUser) {
          this.props.dispatch({
            type: SET_OVERLAY,
            value: 'saveProgress',
          });
        }
      }
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
      inviteName,
    } = this.props;
    if (
      !journeyStep ||
      !journeyStep.status ||
      !journeyStep['completed_by_messenger?'] ||
      !steps ||
      !journey ||
      !journey.kind ||
      !journey.conversation ||
      !journey.conversation.messengers
    )
      return null;
    const isComplete = journeyStep.status === 'completed';
    const isWaiting =
      journeyStep.status === 'active' && journeyStep['completed_by_messenger?'];
    if (!isComplete && !isWaiting) {
      return;
    }
    // If this is the last step and it's complete, don't show this
    if ((steps[steps.length - 1] || {}).id === journeyStep.id) {
      this.props.scrollToEnd();

      return (
        <Flex
          direction="column"
          justify="end"
          align="center"
          style={[st.bgBlue, st.ph2, st.pt2]}
        >
          <Text style={[st.aic, st.fs4, st.mb4, st.ph1, st.tac]}>
            Congrats! You finished the adventure. Now start it with someone
            else!
          </Text>
          <Button
            onPress={this.friend}
            style={[
              st.bgOrange,
              st.ph6,
              st.pv5,
              st.bw0,
              st.br3,
              st.aic,
              { width: st.fullWidth - 60 },
            ]}
          >
            <Flex direction="row" align="center">
              <VokeIcon
                type="image"
                style={[{ height: 20 }, st.mr5]}
                name={'withFriend'}
              />
              <Text>With a Friend</Text>
              <VokeIcon
                type="image"
                style={[{ height: 15 }, st.ml5]}
                name={'buttonArrow'}
              />
            </Flex>
          </Button>
          <Button
            onPress={this.group}
            style={[
              st.bgOrange,
              st.ph6,
              st.pv5,
              st.bw0,
              st.br3,
              st.mv4,
              st.aic,
              { width: st.fullWidth - 60 },
            ]}
          >
            <Flex direction="row" align="center">
              <VokeIcon
                type="image"
                style={[{ height: 20 }, st.mr5]}
                name={'withGroup'}
              />
              <Text>With a Group</Text>
              <VokeIcon
                type="image"
                style={[{ height: 15 }, st.ml5]}
                name={'buttonArrow'}
              />
            </Flex>
          </Button>
        </Flex>
      );
    }

    let text = t('nextVideoReady');
    if (isWaiting) {
      const isSolo = journey && journey.kind !== 'duo';
      if (isSolo) {
        return;
      }
      const otherUser = journey.conversation.messengers.find(
        i => i.id !== me.id && i.first_name !== 'VokeBot',
      );
      // TODO: Pass through invite name
      // if (journey.conversation.messengers.length === 2 && inviteName) {
      //   otherUser = { first_name: inviteName };
      // }
      let userName =
        otherUser && otherUser.first_name
          ? otherUser.first_name
          : inviteName
          ? inviteName
          : '';
      text = t('waitingForAnswer', { name: userName });
    }

    this.props.scrollToEnd();

    return (
      <Button
        text={text}
        onPress={() => dispatch(navigateBack())}
        style={[st.bgOrange, st.mt3, st.br1, st.bw0]}
      />
    );
  };

  renderMessages() {
    const { me, messages, messengers, journeyStep, journey } = this.props;
    const { stateResponse } = this.state;
    const isSolo =
      journey && journey.kind !== 'duo' && journey.kind !== 'multiple';

    let reversed = [...messages].reverse();
    // Keep track of internal state and use that if it exists, otherwise find it in the messages
    const response =
      stateResponse || reversed.find(i => i.messenger_id === me.id);

    // const response =
    //   stateResponse2 ||
    //   reversed.find(
    //     i =>
    //       i.messenger_id === me.id &&
    //       i.messenger_journey_step_id ===
    //       (messageFromMessages.metadata || {}).messenger_journey_step_id,
    //   );

    if (!journeyStep || !journeyStep.status) return null;
    const isComplete = journeyStep.status === 'completed';

    const myFirstMessage = reversed.find(m => m.messenger_id === me.id);
    if (myFirstMessage && myFirstMessage.id) {
      reversed = reversed.filter(m => m.id !== myFirstMessage.id);
    }
    if (isSolo && (journeyStep.metadata || {}).comment) {
      reversed.unshift({
        messenger_id: (messengers.find(i => i.id !== me.id) || {}).id,
        content: (journeyStep.metadata || {}).comment,
        metadata: { vokebot_action: 'journey_step_comment' },
      });
    }
    return reversed.map(m => {
      const isVoke =
        m.metadata &&
        m.metadata.vokebot_action &&
        m.metadata.vokebot_action === 'journey_step_comment';
      const isMine = m.messenger_id === me.id;
      const shouldOverrideBlur = (m.metadata || {}).messenger_journey_step_id;
      const messenger = messengers.find(i => i.id === m.messenger_id) || {};
      const isBlur = !shouldOverrideBlur && !isComplete && !isMine;
      const isShareAnswers =
        m.metadata &&
        m.metadata.vokebot_action &&
        m.metadata.vokebot_action === 'share_answers';

      const isResponse =
        m.messenger_id === me.id &&
        reversed.find(i => {
          if (
            (i.metadata || {}).messenger_journey_step_id ===
            m.messenger_journey_step_id
          ) {
            if (m.id !== i.id) {
              return true;
            }
          }
          return false;
        });

      if (isResponse) {
        return null;
      }

      if (
        shouldOverrideBlur &&
        !m.content &&
        (m.metadata || {}).step_kind === 'binary'
      ) {
        return this.renderBinarySelect(m);
      } else if (
        shouldOverrideBlur &&
        !m.content &&
        (m.metadata || {}).step_kind === 'multi'
      ) {
        return this.renderMultiSelect(m);
      } else if (
        shouldOverrideBlur &&
        !m.content &&
        (m.metadata || {}).step_kind === 'question'
      ) {
        return this.renderStandardInputFromMessages(m);
      } else if (
        shouldOverrideBlur &&
        !m.content &&
        (m.metadata || {}).step_kind === 'share'
      ) {
        return this.renderShareSelect(m);
      }

      if (!m.content) return null;
      return (
        <Flex key={m.id} align="center" style={[st.fw100]}>
          <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
            <Flex ref={c => (this.blurView = c)} direction="row">
              {isMine ? <Flex style={[st.f1]} /> : null}
              <Flex
                direction="column"
                style={[
                  isMine ? st.bgWhite : st.bgDarkBlue,
                  st.br5,
                  st.pd6,
                  st.w100,
                ]}
              >
                {isAndroid && isBlur ? (
                  <Flex style={[st.pd4, st.f1, st.w100]} />
                ) : (
                  <Fragment>
                    {isShareAnswers ? (
                      <Flex style={[st.bgOffBlue, st.pd5, st.br6]}>
                        <Text style={[st.fs4, st.white]}>{m.content}</Text>
                      </Flex>
                    ) : null}
                    <Text style={[st.pd6, st.fs4, isMine ? st.blue : st.white]}>
                      {isAndroid && isBlur
                        ? ''
                        : isShareAnswers
                        ? (m.metadata || {}).messenger_answer
                        : m.content}
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

  renderBinarySelect = message => {
    const { me } = this.props;
    const { otherMultiChoiceAnswers } = this.state;
    const metadata = message.metadata || {};
    const answers = metadata.answers;
    const hasSelected = (answers || []).find(a => a.selected);
    return (
      <Flex key={message.id} align="center" style={[st.fw100]}>
        <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
          <Flex direction="row">
            <Flex style={[st.f1]} />
            <Flex
              direction="column"
              align="center"
              style={[st.bgBlack, st.ovh, st.br5, st.w100]}
            >
              {(metadata.image || {}).small ? (
                <Image
                  source={{ uri: metadata.image.small }}
                  style={[st.absfill]}
                />
              ) : null}
              <Text style={[st.pd3, st.fs1, st.white]}>{metadata.name}</Text>
              <Text style={[st.ph3, st.tal, st.fs4, st.white]}>
                {metadata.comment}
              </Text>
              <Flex
                direction="column"
                align="center"
                style={[
                  st.ph4,
                  st.pv4,
                  st.mt4,
                  st.w100,
                  {
                    marginRight: -20,
                    marginLeft: -20,
                    backgroundColor: st.colors.lightOrange,
                  },
                ]}
              >
                <Text style={[[st.pv4, st.tac, st.fs(20), st.lh(24)]]}>
                  {metadata.question}
                </Text>
                <Flex direction="row">
                  {answers.map((a, index) => (
                    <Button
                      text={a.key}
                      disabled={hasSelected}
                      onPress={() => {
                        this.setState(
                          {
                            otherMultiChoiceAnswers: {
                              ...otherMultiChoiceAnswers,
                              [message.id]: a.value,
                            },
                          },
                          () => {
                            this.sendMessage(
                              false,
                              false,
                              true,
                              false,
                              metadata.messenger_journey_step_id,
                              message.id,
                              a.value,
                            );
                          },
                        );
                      }}
                      style={[
                        a.selected ? st.bgWhite : st.bgOrange,
                        st.br1,
                        st.mh5,
                        a.selected || !hasSelected
                          ? { opacity: 1 }
                          : { opacity: 0.4 },
                      ]}
                      buttonTextStyle={[a.selected ? st.orange : st.white]}
                    />
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Avatar
            image={(me.avatar || {}).small}
            isVoke={false}
            size={25}
            style={[st.absb, st.right(-30)]}
          />
        </Flex>
        <Flex direction="column" style={[st.w80]}>
          <DateComponent
            style={[st.fs6, st.tar]}
            date={message.created_at}
            format={dateFormat}
          />
        </Flex>
      </Flex>
    );
  };
  renderShareSelect = message => {
    const { me } = this.props;
    const { otherMultiChoiceAnswers } = this.state;
    const metadata = message.metadata || {};
    const answers = metadata.answers;
    const hasSelected = (answers || []).find(a => a.selected);
    return (
      <Flex key={message.id} align="center" style={[st.fw100]}>
        <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
          <Flex direction="row">
            <Flex style={[st.f1]} />
            <Flex
              direction="column"
              align="center"
              style={[st.bgDarkBlue, st.br5, st.w100, st.pd4]}
            >
              <Text style={[[st.pd4, st.tac, st.fs(20), st.lh(24)]]}>
                {metadata.question}
              </Text>
              <Flex direction="row" style={[st.pb4]}>
                {answers.map((a, index) => (
                  <Button
                    text={a.key}
                    disabled={hasSelected}
                    onPress={() => {
                      this.setState(
                        {
                          otherMultiChoiceAnswers: {
                            ...otherMultiChoiceAnswers,
                            [message.id]: a.value,
                          },
                        },
                        () => {
                          this.sendMessage(
                            false,
                            false,
                            true,
                            false,
                            metadata.messenger_journey_step_id,
                            message.id,
                            a.value,
                          );
                        },
                      );
                    }}
                    style={[
                      a.selected ? st.bgWhite : st.bgOrange,
                      st.br1,
                      st.mh5,
                      a.selected || !hasSelected
                        ? { opacity: 1 }
                        : { opacity: 0.4 },
                    ]}
                    buttonTextStyle={[a.selected ? st.orange : st.white]}
                  />
                ))}
              </Flex>
            </Flex>
          </Flex>

          <Avatar
            image={(me.avatar || {}).small}
            isVoke={false}
            size={25}
            style={[st.absb, st.right(-30)]}
          />
        </Flex>
        <Flex direction="column" style={[st.w80]}>
          <DateComponent
            style={[st.fs6, st.tar]}
            date={message.created_at}
            format={dateFormat}
          />
        </Flex>
      </Flex>
    );
  };

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
    const { t, setCustomRender, journey } = this.props;
    const { height } = this.state;
    const modelName = DeviceInfo.getModel();
    const isIphone11 =
      modelName === 'iPhone 11' ||
      modelName === 'iPhone 11 Pro' ||
      modelName === 'iPhone 11 Pro Max';
    const isSolo =
      journey && journey.kind !== 'duo' && journey.kind !== 'multiple';
    if (isSolo) return;
    let inputHeight = {
      height: height < 45 ? 45 : height > 140 ? 140 : height,
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
          style={[
            newWrap,
            st.w100,
            !isAndroid ? st.absblr : null,
            isIphone11 ? { marginBottom: 45 } : undefined,
          ]}
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
              style={[
                st.f1,
                st.white,
                st.pv6,
                st.mv6,
                st.fs4,
                inputHeight,
                st.pt4,
              ]}
              selectionColor={st.colors.yellow}
              autoCorrect={true}
              multiline={true}
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

  renderStandardInputFromMessages = messageFromMessages => {
    const { t, me, messages, journey } = this.props;
    const { text2, stateResponse2, isResponseSet2 } = this.state;
    const inputStyle = [st.f1, st.fs4, st.darkBlue];
    const reversed = [...messages].reverse();
    // Keep track of internal state and use that if it exists, otherwise find it in the messages
    const response =
      stateResponse2 ||
      reversed.find(
        i =>
          i.messenger_id === me.id &&
          i.messenger_journey_step_id ===
            (messageFromMessages.metadata || {}).messenger_journey_step_id,
      );
    const isSkipped = response && response.content === '';
    if (response && !isResponseSet2) {
      this.setState({ isResponseSet2: true });
    }
    const isSolo = journey && journey.kind !== 'duo';
    return (
      <Flex key={messageFromMessages.id} align="center" style={[st.fw100]}>
        <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
          <Flex ref={c => (this.blurView = c)} direction="row">
            <Flex style={[st.f1]} />
            <Flex
              direction="column"
              style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
              align="center"
              justify="center"
            >
              <Text style={[st.tac, st.fs(20), st.lh(24)]}>
                {messageFromMessages.metadata.question}
              </Text>
            </Flex>
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
                  onSubmitEditing={() =>
                    this.sendMessage(
                      false,
                      false,
                      false,
                      true,
                      {
                        id: (messageFromMessages.metadata || {})
                          .messenger_journey_step_id,
                      },
                      messageFromMessages.id,
                    )
                  }
                  placeholder={t('yourAnswer')}
                  placeholderTextColor={st.colors.grey}
                  style={inputStyle}
                  underlineColorAndroid={st.colors.transparent}
                  selectionColor={st.colors.darkBlue}
                  value={text2}
                  onChangeText={this.changeText2}
                />
                {!text2 && isSolo ? (
                  <Button
                    type="transparent"
                    onPress={() =>
                      this.skip(
                        (messageFromMessages.metadata || {})
                          .messenger_journey_step_id,
                        messageFromMessages.id,
                      )
                    }
                    text={t('skip').toUpperCase()}
                    buttonTextStyle={[st.orange, st.bold, st.fs4, st.ls2]}
                  />
                ) : (
                  <Button
                    type="transparent"
                    onPress={() =>
                      this.sendMessage(
                        false,
                        false,
                        false,
                        true,
                        {
                          id: (messageFromMessages.metadata || {})
                            .messenger_journey_step_id,
                        },
                        messageFromMessages.id,
                      )
                    }
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
            <Avatar
              image={(me.avatar || {}).small}
              isVoke={false}
              size={25}
              style={[st.absb, st.right(-30)]}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  };
  renderStandardInput = () => {
    const { t, me, messages, journey } = this.props;
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
    const isSolo = journey && journey.kind !== 'duo';
    return (
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
            {!text && isSolo ? (
              <Button
                type="transparent"
                onPress={() => this.skip()}
                text={t('skip').toUpperCase()}
                buttonTextStyle={[st.orange, st.bold, st.fs4, st.ls2]}
              />
            ) : (
              <Button type="transparent" onPress={() => this.sendMessage()}>
                <VokeIcon name="send_message" size={20} style={[st.offBlue]} />
              </Button>
            )}
          </Fragment>
        )}
      </Flex>
    );
  };

  renderMultiSelect = messageFromMessages => {
    const { me, messages, messengers, journeyStep } = this.props;
    const meMessenger = messengers.find(i => i.id === me.id);

    const answers = messageFromMessages
      ? (messageFromMessages.metadata || {}).answers
      : (journeyStep.metadata || {}).answers;
    if ((answers || []).length === 0) return;

    let formattedAnswers = answers.map(a => ({
      value: a.value,
      label: a.key,
    }));

    const isComplete = journeyStep.status === 'completed';
    if (isComplete) {
      formattedAnswers = formattedAnswers.map(a => ({ ...a, disabled: true }));
    }
    const selectedAnswerForOtherMultiChoice =
      answers.find(a => a.selected) || {};

    if (messageFromMessages) {
      return (
        <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
          <Flex
            direction="column"
            style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
            align="center"
            justify="center"
          >
            <Text style={[st.tac, st.fs(20), st.lh(24)]}>
              {(messageFromMessages.metadata || {}).question || null}
            </Text>
          </Flex>
          <Avatar
            image={(meMessenger.avatar || {}).small}
            size={25}
            style={[st.absb, st.right(-30)]}
          />
          <Select
            isMulti={false}
            options={formattedAnswers}
            placeholder="Choose Your Answer..."
            selectedValue={
              this.state.otherMultiChoiceAnswers[messageFromMessages.id] ||
              selectedAnswerForOtherMultiChoice.value
            }
            onUpdate={t => {
              this.setState(
                {
                  otherMultiChoiceAnswers: {
                    ...this.state.otherMultiChoiceAnswers,
                    [messageFromMessages.id]: t.value,
                  },
                },
                () => {
                  this.sendMessage(
                    false,
                    false,
                    true,
                    false,
                    (messageFromMessages.metadata || {})
                      .messenger_journey_step_id,
                    messageFromMessages.id,
                    t.value,
                  );
                },
              );
            }}
            containerColor={st.colors.orange}
          />
        </Flex>
      );
    }

    return (
      <Select
        isMulti={false}
        options={formattedAnswers}
        placeholder="Choose Your Answer..."
        selectedValue={this.state.multiChoiceAnswer}
        onUpdate={t => {
          this.setState({ multiChoiceAnswer: t.value }, () => {
            this.sendMessage(false, true);
          });
        }}
        containerColor={st.colors.orange}
      />
    );
  };

  render() {
    const { me, messages, messengers, journeyStep } = this.props;
    const { stateResponse, isResponseSet } = this.state;

    const isMultiSelect =
      journeyStep.kind === 'binary' || journeyStep.kind === 'multi';
    const reversed = [...messages].reverse();
    // Keep track of internal state and use that if it exists, otherwise find it in the messages
    const response =
      stateResponse || reversed.find(i => i.messenger_id === me.id);
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
            <Avatar
              image={(meMessenger.avatar || {}).small}
              size={25}
              style={[st.absb, st.right(-30)]}
            />
            {isMultiSelect
              ? this.renderMultiSelect()
              : this.renderStandardInput()}
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
  inviteName: PropTypes.string,
};

const mapStateToProps = (
  { auth, journeys },
  {
    navigation: {
      state: { params },
    },
  },
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
  isAnonUser: auth.isAnonUser,
  steps: journeys.steps[params.journey.id] || [],
  myJourneys: journeys.mine,
});

export default translate('journey')(
  connect(mapStateToProps)(JourneyStepDetail),
);
