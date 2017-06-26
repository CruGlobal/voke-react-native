
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, View } from 'react-native';
import styles from './styles';

// import { navigateAction } from '../../actions/navigation';

import { Flex, Icon, Text, Touchable, Separator, RefreshControl } from '../../components/common';

function formatConversations(c) {
  return Object.keys(c).map((k) => c[k]);
}

class VideoList extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.text !== r2.text,
    });
    this.state = {
      refreshing: false,
      dataSource: ds.cloneWithRows(formatConversations(props.items)),
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(formatConversations(nextProps.items)) });
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => {
      // this.props.onRefresh();
      this.setState({ refreshing: false });
    }, 500);
  }

  renderRow(video) {
    return (
      <Touchable highlight={false} activeOpacity={0.6} onPress={() => this.props.onSelect(video)}>
        <View>
          <Flex style={styles.container} direction="column" align="center" justify="center">
            <Flex style={styles.videoThumbnail}>
            </Flex>
            <Flex direction="column" style={styles.videoText}>
              <Flex align="start" justify="start">
                <Text style={styles.videoTitle}>
                  {video.title}
                </Text>
              </Flex>
              <Flex align="start" justify="start" style={{paddingTop: 20}}>
                <Text style={styles.videoDescription}>
                  {video.description}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </View>
      </Touchable>
    );
  }

  render() {
    return (
      <ListView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}
        style={{ flex: 1 }}
        enableEmptySections={true}
        contentContainerStyle={styles.content}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

VideoList.propTypes = {
  onRefresh: PropTypes.func.isRequired, // Redux
  onSelect: PropTypes.func.isRequired, // Redux
  items: PropTypes.array.isRequired, // Redux
};

export default VideoList;
