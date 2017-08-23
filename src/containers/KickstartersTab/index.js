import React, { Component } from 'react';
import { ScrollView, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { getKickstarters } from '../../actions/videos';
import CHAT_ICON from '../../../images/SendButton.png';
import styles from './styles';
import { Flex, Text, Touchable } from '../../components/common';

class KickstartersTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      kickstarters: [],
    };

    this.getKickstarters = this.getKickstarters.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.getKickstarters();
  }

  getKickstarters() {
    this.props.dispatch(getKickstarters(this.props.latestItem)).then((results)=>{
      this.setState({ kickstarters: results.questions });
    });
  }

  renderRow({ item }) {
    return (
      <Touchable highlight={false} activeOpacity={0.8} onPress={() => this.props.onSelect(item)}>
        <Flex
          direction="column"
          align="start"
          justify="center"
          animation="slideInUp"
        >
          <Flex direction="column" align="start" justify="start" style={styles.videoDetails}>
            <Text numberOfLines={1} style={styles.videoTitle}>
              {item.content}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  render() {
    return (
      <Flex direction="column" value={1} align="center" justify="center" style={styles.container}>
        <Flex align="center" value={1} style={styles.chatImageWrap}>
          <Image source={CHAT_ICON} style={styles.chatImage} />
          <Text style={styles.description}>Add one of these kickstarters to your chat.</Text>
        </Flex>
        <Flex value={4}>
          <Image source={CHAT_ICON} style={styles.chatImage} />
          <FlatList
            ref={(c) => this.list = c}
            initialNumToRender={4}
            data={this.state.kickstarters}
            renderItem={this.renderRow}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
          />
        </Flex>
      </Flex>
    );
  }
}

KickstartersTab.propTypes = {
  ...NavPropTypes,
  onSelect: PropTypes.func.isRequired,
  latestItem: PropTypes.string,
};

export default connect(null, nav)(KickstartersTab);
