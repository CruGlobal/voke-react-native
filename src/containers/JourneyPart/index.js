import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';

class JourneyPart extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.JourneyPart);
  }
  render() {
    const { item } = this.props;

    return (
      <ScrollView style={styles.content} contentContainerStyle={{ flex: 1 }}>
        <Flex value={1}>
          <Flex style={styles.mainContent}>
            <Text style={styles.header}>{item.name}</Text>
            <Text style={styles.series}>JourneyPart</Text>
          </Flex>
          <Flex value={1} justify="end">
            <Flex style={styles.card} align="center" justify="center">
              <Text style={styles.start}>Start {item.name}</Text>
              <Flex direction="row" align="center">
                <Button
                  text="By Myself fdsaf"
                  style={[styles.button, styles.left]}
                />
                <Button
                  text="With a Friend"
                  style={[styles.button, styles.right]}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>
    );
  }
}

JourneyPart.propTypes = {
  item: PropTypes.object.isRequired,
  onPause: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
});

export default translate('journey')(connect(mapStateToProps)(JourneyPart));
