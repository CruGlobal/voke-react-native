import React, { Component } from 'react';
import { ScrollView, Image } from 'react-native';
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
    console.warn('this.props.latestItem', this.props.latestItem);
    this.props.dispatch(getKickstarters(this.props.latestItem)).then((results)=>{
      console.warn('results', results);
      this.setState({ kickstarters: results.questions });
    }).catch((err) => {
      console.warn('kickstarter err', err);
    });
  }

  renderRow(item) {
    return (
      <Touchable highlight={false} activeOpacity={0.8} onPress={() => this.props.onSelectKickstarter(item.content)} key={item.id}>
        <Flex
          direction="column"
          align="start"
          justify="center"
          animation="slideInUp"
        >
          <Flex direction="column" align="start" justify="start" style={styles.kickstarterWrap}>
            <Text style={styles.kickstarterText}>
              {item.content}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Flex align="center" value={1} style={styles.chatImageWrap}>
          <Image source={CHAT_ICON} style={styles.chatImage} />
          <Text style={styles.description}>Add one of these kickstarters to your chat.</Text>
        </Flex>
        <Flex value={1} align="center" justify="center" style={styles.content}>
          {this.state.kickstarters.map(this.renderRow)}
        </Flex>
      </ScrollView>
    );
  }
}

KickstartersTab.propTypes = {
  ...NavPropTypes,
  onSelect: PropTypes.func.isRequired,
  latestItem: PropTypes.string,
};

export default connect(null, nav)(KickstartersTab);
