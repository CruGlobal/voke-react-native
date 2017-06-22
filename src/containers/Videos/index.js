import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import { navigateAction } from '../../actions/navigation';

import SubHeader from '../SubHeader';
import VideoList from '../../components/VideoList';
import StatusBar from '../../components/StatusBar';

const VIDEOS = [
  {title: 'The odds of you explained...', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {title: 'The best video ever', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {title: 'another one', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {title: 'DJ Kahled does another one', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {title: 'Bryan doing the hokie pokie', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
];

class Videos extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <View style={styles.container}>
        <SubHeader />
        <StatusBar />
        <VideoList
          items={VIDEOS}
          onSelect={(c) => dispatch(navigateAction('VideoDetails', c))}
          onRefresh={() => {}}
        />
      </View>
    );
  }
}

Videos.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Videos);
