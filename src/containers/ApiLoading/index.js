import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Text } from '../../components/common';
import ANIMATION from '../../../images/VokeBotAnimation.gif';

class ApiLoading extends Component {
  constructor(props) {
    super(props);
    this.state = { showLoading: !!(props.showMS && props.showMS > 0) };
    this.timeout = null;
  }

  componentDidMount() {
    if (this.props.showMS) {
      this.timeout = setTimeout(() => {
        this.setState({ showLoading: false });
      }, this.props.showMS);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    if (
      !this.state.showLoading &&
      !this.props.isApiLoading &&
      !this.props.force
    )
      return null;
    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Image
          style={{ marginBottom: 20, height: 100 }}
          resizeMode="contain"
          source={ANIMATION}
        />
        {this.props.text ? (
          <Text style={styles.text}>{this.props.text}</Text>
        ) : null}
      </Flex>
    );
  }
}

ApiLoading.propTypes = {
  isApiLoading: PropTypes.bool.isRequired, // Redux
  showMS: PropTypes.number, // Time (in milliseconds) to show the loading screen
  force: PropTypes.bool, // force the loading to show
  text: PropTypes.string, // string to show the user what is happening
};

const mapStateToProps = ({ auth }) => {
  return {
    isApiLoading: auth.apiActive > 0,
  };
};

export default translate()(connect(mapStateToProps)(ApiLoading));
