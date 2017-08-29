import React, { Component } from 'react';
import { ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { getKickstarters } from '../../actions/videos';
import CHAT_ICON from '../../../images/SendButton.png';
import styles from './styles';
import { Flex, Text, Touchable, Loading } from '../../components/common';

class KickstartersTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
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
    this.setState({ isLoading: true });
    // console.warn('this.props.latestItem', this.props.latestItem);
    this.props.dispatch(getKickstarters(this.props.latestItem)).then((results)=>{
      // console.warn('results', results);
      this.setState({ kickstarters: results.questions, isLoading: false });
    }).catch((err) => {
      // console.warn('kickstarter err', err);
      this.setState({ isLoading: false });
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

  renderHeader() {
    const { kickstarters, isLoading } = this.state;
    if (isLoading || kickstarters.length === 0) {
      return null;
    }

    return (
      <Flex align="center" value={1} style={styles.chatImageWrap}>
        <Text style={styles.description}>Add one of these kickstarters to your chat.</Text>
        <Image source={CHAT_ICON} style={styles.chatImage} />
      </Flex>
    );
  }

  render() {
    const { kickstarters, isLoading } = this.state;
    const hasKickstarters = kickstarters.length > 0;
    let content = null;
    if (isLoading) {
      content = <Loading />;
    } else if (!hasKickstarters) {
      content = (
        <Text style={styles.nothingText}>No Kickstarter messages available</Text>
      );
    } else {
      content = this.state.kickstarters.map(this.renderRow);
    }
    
    
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={isLoading || !hasKickstarters ? { flex: 1 } : undefined}
      >
        {this.renderHeader()}
        <Flex value={1} align="center" justify="center" style={styles.content}>
          {content}
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
