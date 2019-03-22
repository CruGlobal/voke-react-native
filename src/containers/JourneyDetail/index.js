import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, Image } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';

import {
  Flex,
  Touchable,
  RefreshControl,
  Text,
  Icon,
} from '../../components/common';
import { getMyJourneySteps } from '../../actions/journeys';
import st from '../../st';
import { navigatePush } from '../../actions/nav';
import { buildTrackingObj } from '../../utils/common';

function Item({ item, onSelect }) {
  const isActive = item.status === 'active';
  const isCompleted = item['completed_by_messenger?'];
  const isLocked = !isCompleted && !isActive;
  return (
    <Touchable
      highlight={false}
      activeOpacity={0.8}
      onPress={() => onSelect(item)}
    >
      <Flex
        style={[
          isActive ? st.bgWhite : st.bgDarkBlue,
          isLocked ? st.op50 : null,
          st.mv6,
          st.mh4,
          st.br5,
          { minHeight: 84 },
        ]}
        direction="row"
        align="center"
        justify="start"
      >
        <Flex style={[st.m5, st.rel]}>
          <Image
            source={{ uri: item.item.content.thumbnails.small }}
            style={[{ width: 100 }, st.bgBlack, st.f1]}
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
            Part {item.position}
          </Text>
        </Flex>
        <Flex style={[st.absbr, { bottom: -28 }, st.mh5]}>
          <Text style={[st.blue, { fontSize: 72 }]}>{item.position}</Text>
        </Flex>
      </Flex>
    </Touchable>
  );
}

class JourneyDetail extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    console.log('items', this.props.item);

    this.load();
  }

  load = async () => {
    const { dispatch, item } = this.props;
    const results = await dispatch(getMyJourneySteps(item.id));
    console.log('results', results);
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
    const { dispatch } = this.props;
    dispatch(
      navigatePush(
        'voke.VideoContentWrap',
        {
          item: step,
          type: 'journeyStepDetail',
          trackingObj: buildTrackingObj('journey : mine', 'detail', 'step'),
        },
        'journeyStepDetail',
      ),
    );
  };

  renderRow = ({ item }) => {
    return <Item item={item} onSelect={this.select} />;
  };

  render() {
    const { steps } = this.props;
    return (
      <FlatList
        data={steps}
        renderItem={this.renderRow}
        keyExtractor={item => item.id}
        style={styles.content}
        contentContainerStyle={[st.f1]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
      />
    );
  }
}

JourneyDetail.propTypes = {
  item: PropTypes.object.isRequired,
  onPause: PropTypes.func.isRequired,
};

const mapStateToProps = ({ journeys }, { item }) => ({
  steps: journeys.steps[item.id] || [],
});

export default translate('journeyDetail')(
  connect(mapStateToProps)(JourneyDetail),
);
