import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, Image } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';

import { Flex, Touchable, RefreshControl, Text } from '../../components/common';
import { getMyJourneySteps } from '../../actions/journeys';
import st from '../../st';

function Item({ item, onSelect }) {
  const isActive = item.status === 'active';
  return (
    <Touchable
      highlight={false}
      activeOpacity={0.8}
      onPress={() => onSelect(item)}
    >
      <Flex
        style={[
          isActive ? st.bgWhite : [st.bgDarkBlue, st.op50],
          st.mv6,
          st.mh4,
          { minHeight: 84 },
        ]}
        direction="row"
        align="center"
        justify="start"
      >
        <Image
          source={{ uri: item.item.content.thumbnails.small }}
          style={[st.mh5, { width: 75 }, st.bgBlack, st.h75]}
          resizeMode="cover"
        />
        <Flex value={1} direction="column" self="start" style={[st.pd5]}>
          <Text
            numberOfLines={1}
            style={[st.fs4, isActive ? st.darkBlue : st.white]}
          >
            {item.name}
          </Text>
        </Flex>
        <Flex style={[st.absBR, { bottom: -28 }, st.mh5]}>
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

  renderRow = ({ item }) => {
    return <Item item={item} />;
  };

  render() {
    const { steps } = this.props;
    if (!steps[0]) {
      return null;
    }
    return (
      <Flex style={styles.content}>
        <Item item={steps[0]} />
        <Item item={steps[1]} />
      </Flex>
    );
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
