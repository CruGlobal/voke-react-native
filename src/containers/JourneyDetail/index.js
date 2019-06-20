import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  FlatList,
  Image,
  Flex,
  Touchable,
  RefreshControl,
  Text,
  Icon,
  VokeIcon,
} from '../../components/common';
import {
  getMyJourneySteps,
  activeJourneyConversation,
  inactiveJourneyConversation,
} from '../../actions/journeys';
import st from '../../st';
import { navigatePush } from '../../actions/nav';
import { buildTrackingObj, keyExtractorId } from '../../utils/common';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';
import { isAndroid } from '../../constants';
import JourneyUnreadCount from '../../components/JourneyUnreadCount';

function StepItem({ t, me, item, journey, onSelect, inviteName }) {
  const isActive = item.status === 'active';
  const isCompleted = item.status === 'completed';
  const isLocked = !isCompleted && !isActive;
  const isWaiting = isActive && item['completed_by_messenger?'];

  const unreadCount = item.unread_messages;
  const hasUnread = unreadCount > 0;
  let otherUser = journey.conversation.messengers.find(
    i => i.id !== me.id && i.first_name !== 'VokeBot',
  );

  if (journey.conversation.messengers.length === 2 && inviteName) {
    otherUser = { first_name: inviteName };
  }

  return (
    <Touchable
      highlight={false}
      disabled={isLocked}
      activeOpacity={0.8}
      onPress={() => onSelect(item)}
    >
      <Flex
        style={[
          isActive ? st.bgWhite : st.bgOffBlue,
          isLocked ? st.op50 : null,
          st.mv6,
          st.mh4,
          st.br5,
        ]}
        align="center"
        justify="start"
      >
        <Flex direction="row" style={[st.minh(84)]}>
          <Flex style={[st.m5, st.rel]}>
            <Image
              source={{ uri: item.item.content.thumbnails.small }}
              style={[st.w(100), st.bgBlack, st.f1]}
              resizeMode="contain"
            />
            <Flex style={[st.absfill]} align="center" justify="center">
              <Icon
                name={isLocked ? 'lock' : 'play-circle-filled'}
                size={30}
                style={[st.white, st.op90]}
              />
            </Flex>
          </Flex>
          <Flex value={1} direction="column" self="start" style={[st.pv6]}>
            <Text
              numberOfLines={1}
              style={[st.fs4, isActive ? st.darkBlue : st.white]}
            >
              {item.name}
            </Text>
            <Text style={[st.fs5, isActive ? st.darkBlue : st.white]}>
              {t('part')} {item.position}
            </Text>
            {isActive || isCompleted ? (
              <Flex direction="row" align="center" style={[st.pt6]}>
                <VokeIcon
                  name="Chat"
                  style={[
                    hasUnread
                      ? st.orange
                      : isCompleted ? st.white : st.charcoal,
                  ]}
                />
                {hasUnread ? <JourneyUnreadCount count={unreadCount} /> : null}
              </Flex>
            ) : null}
          </Flex>
          <Flex
            style={[
              st.absbr,
              isAndroid ? st.bottom(-23) : st.bottom(-28),
              st.mh5,
            ]}
          >
            <Text style={[isWaiting ? st.orange : st.blue, st.fs(72)]}>
              {item.position}
            </Text>
          </Flex>
        </Flex>
        {isWaiting ? (
          <Flex
            align="center"
            style={[st.bgOrange, st.w100, st.pd6, st.brbl5, st.brbr5]}
          >
            <Text style={[st.fs4]}>
              {t('waitingForAnswer', { name: (otherUser || {}).first_name })}
            </Text>
          </Flex>
        ) : null}
        {isCompleted ? (
          <Flex
            style={[
              st.abs,
              st.top(-5),
              st.right(-5),
              st.bgDarkerBlue,
              st.pd6,
              st.br2,
            ]}
          >
            <Icon name="check" size={16} style={[st.white]} />
          </Flex>
        ) : null}
      </Flex>
    </Touchable>
  );
}

class JourneyDetail extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    const { dispatch, navToStep, item } = this.props;
    dispatch(activeJourneyConversation(item));

    this.load();
    if (navToStep) {
      this.select(navToStep);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(inactiveJourneyConversation());
  }

  load = async () => {
    const { dispatch, item } = this.props;
    const results = await dispatch(getMyJourneySteps(item.id));
    return results;
  };

  handleRefresh = () => {
    this.setState({ refreshing: true });
    this.load()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  };

  select = step => {
    const isActive = step.status === 'active';
    const isCompleted = step['completed_by_messenger?'];
    const isLocked = !isCompleted && !isActive;
    if (isLocked) {
      return;
    }
    const { dispatch, item, onPause, inviteName } = this.props;
    onPause();
    dispatch(
      navigatePush(
        'voke.VideoContentWrap',
        {
          item: step,
          journey: item,
          inviteName,
          type: VIDEO_CONTENT_TYPES.JOURNEYSTEPDETAIL,
          trackingObj: buildTrackingObj('journey : mine', 'detail', 'step'),
        },
        VIDEO_CONTENT_TYPES.JOURNEYSTEPDETAIL,
      ),
    );
  };

  renderRow = ({ item: stepItem }) => {
    const { t, me, item, inviteName } = this.props;
    return (
      <StepItem
        t={t}
        me={me}
        journey={item}
        item={stepItem}
        inviteName={inviteName}
        onSelect={this.select}
      />
    );
  };

  render() {
    const { steps } = this.props;

    // Dev for hot reloading
    // return (
    //   <Flex style={[st.f1, st.pt5, st.bgBlue]}>
    //     {steps[0] && <Item item={steps[0]} onSelect={this.select} />}
    //     {steps[1] && <Item item={steps[1]} onSelect={this.select} />}
    //   </Flex>
    // );
    return (
      <FlatList
        data={steps}
        renderItem={this.renderRow}
        keyExtractor={keyExtractorId}
        style={[st.f1, st.bgBlue, st.pt5, st.minh100]}
        contentContainerStyle={[st.f1]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        removeClippedSubviews={false}
      />
    );
  }
}

JourneyDetail.propTypes = {
  item: PropTypes.object.isRequired, // Journey object
  onPause: PropTypes.func.isRequired,
  navToStep: PropTypes.object,
  inviteName: PropTypes.string,
};

const mapStateToProps = ({ auth, journeys }, { item }) => ({
  me: auth.user,
  steps: journeys.steps[item.id] || [],
});

export default translate('journey')(connect(mapStateToProps)(JourneyDetail));
