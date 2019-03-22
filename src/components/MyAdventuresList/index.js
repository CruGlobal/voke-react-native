import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Image, View } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';
import ANIMATION from '../../../images/VokeBotAnimation.gif';
import st from '../../st';

import {
  Flex,
  Text,
  Touchable,
  Icon,
  RefreshControl,
  VokeIcon,
} from '../common';

const ITEM_HEIGHT = 64 + 20;

class MyAdventuresList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  handleRefresh = () => {
    this.setState({ refreshing: true });
    this.props
      .onRefresh()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  };

  scrollToBeginning(animated = true) {
    if (this.props.items.length > 0) {
      this.list.scrollToIndex({ index: 0, animated });
    }
  }

  renderProgress = () => {
    return <View style={[st.bgBlue, st.circle(10)]} />;
  };

  renderRow = ({ item }) => {
    const { t } = this.props;
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
          animation="slideInUp"
        >
          <Flex>
            <Image
              source={{ uri: item.item.content.thumbnails.small }}
              style={styles.adventureThumbnail}
            />
          </Flex>
          <Flex
            direction="column"
            align="start"
            justify="start"
            style={[st.pv6, st.ph4]}
          >
            <Text numberOfLines={1} style={[st.pb6, styles.adventureTitle]}>
              {item.name}
            </Text>
            <Flex direction="row" align="center" style={[st.pb6]}>
              <VokeIcon name="Chat" style={[st.orange]} />
              <Flex
                align="center"
                justify="center"
                style={[st.circle(20), st.bgOrange, st.ml6]}
              >
                <Text>1</Text>
              </Flex>
            </Flex>
            <Flex direction="row" align="center">
              {this.renderProgress()}
              <Text numberOfLines={2} style={[st.ml6, styles.adventureUser]}>
                6/8 Complete
              </Text>
            </Flex>
          </Flex>
          <Flex
            value={1}
            align="end"
            justify="end"
            style={{ paddingHorizontal: 10 }}
          />
        </Flex>
      </Touchable>
    );
  };

  render() {
    return (
      <FlatList
        ref={c => (this.list = c)}
        initialNumToRender={10}
        data={this.props.items}
        renderItem={this.renderRow}
        keyExtractor={item => item.id}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        style={[st.f1]}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        onEndReached={this.props.onLoadMore}
        ListHeaderComponent={this.props.header}
      />
    );
  }
}

MyAdventuresList.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  header: PropTypes.func,
};

export default translate('videos', { wait: true, withRef: true })(
  MyAdventuresList,
);
