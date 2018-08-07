import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import nav, { NavPropTypes } from '../../actions/nav';
import { getKickstarters } from '../../actions/videos';

import styles from './styles';
import ApiLoading from '../ApiLoading';
import Header from '../Header';
import { Flex, Text, Touchable, VokeIcon } from '../../components/common';

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
    Analytics.screen(Analytics.s.ChatKickstarters);
  }

  getKickstarters() {
    if (this.props.latestItem) {
      this.props
        .dispatch(getKickstarters(this.props.latestItem))
        .then(results => {
          this.setState({ kickstarters: results.questions });
        })
        .catch(err => {
          LOG('kickstarter err', err);
          this.setState({ kickstarters: [] });
        });
    } else {
      this.setState({ kickstarters: [] });
    }
  }

  renderRow(item) {
    return (
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={() => this.props.onSelectKickstarter(item)}
        key={item.id}
      >
        <Flex
          direction="column"
          align="start"
          justify="center"
          style={styles.kickstarterWrap}
        >
          <Text style={styles.kickstarterText}>{item.content}</Text>
        </Flex>
      </Touchable>
    );
  }

  renderHeader() {
    const { t } = this.props;
    const { kickstarters } = this.state;
    if (kickstarters.length === 0) {
      return null;
    }

    return (
      <Flex align="center" value={1} style={styles.chatImageWrap}>
        <VokeIcon name="kickstarter" style={styles.chatImage} />
        <Text style={styles.description}>{t('description')}</Text>
      </Flex>
    );
  }

  render() {
    const { t } = this.props;
    const { kickstarters } = this.state;
    const hasKickstarters = kickstarters.length > 0;
    let content = null;
    if (!hasKickstarters) {
      content = <Text style={styles.nothingText}>{t('nothing')}</Text>;
    } else {
      content = kickstarters.map(this.renderRow);
    }

    return (
      <View style={{ flex: 1 }}>
        <Header leftBack={true} title={t('title.kickstarters')} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={!hasKickstarters ? { flex: 1 } : undefined}
        >
          {this.renderHeader()}
          <Flex
            value={1}
            align="center"
            justify="center"
            style={styles.content}
            animation="slideInUp"
          >
            {content}
          </Flex>
          <ApiLoading />
        </ScrollView>
      </View>
    );
  }
}

KickstartersTab.propTypes = {
  ...NavPropTypes,
  onSelectKickstarter: PropTypes.func.isRequired,
  latestItem: PropTypes.string,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('kickstarters')(
  connect(
    mapStateToProps,
    nav,
  )(KickstartersTab),
);
