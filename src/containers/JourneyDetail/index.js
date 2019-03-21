import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, Image } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';

import { Flex, Touchable, RefreshControl, Text } from '../../components/common';
import { getMyJourneySteps } from '../../actions/journeys';

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

  renderRow = ({ item }) => {
    return (
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={() => this.props.onSelect(item)}
      >
        <Flex
          style={styles.container}
          direction="row"
          align="center"
          justify="start"
        >
          <Image
            source={{ uri: item.item.content.thumbnails.small }}
            style={styles.adventureThumbnail}
          />
          <Flex
            direction="column"
            align="start"
            justify="start"
            style={{ paddingHorizontal: 10 }}
          >
            <Text numberOfLines={1} style={styles.adventureTitle}>
              {item.name}
            </Text>
            <Text numberOfLines={2} style={styles.adventureUser}>
              {item.description}
            </Text>
          </Flex>
          <Flex
            value={1}
            align="end"
            justify="end"
            style={{ paddingHorizontal: 10 }}
          >
            <Flex align="center" justify="center" style={styles.notification}>
              <Text>1</Text>
            </Flex>
          </Flex>
        </Flex>
      </Touchable>
    );
  };

  render() {
    const { steps } = this.props;
    return (
      <FlatList
        data={steps}
        renderItem={this.renderRow}
        keyExtractor={item => item.id}
        style={styles.content}
        contentContainerStyle={{ flex: 1 }}
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
