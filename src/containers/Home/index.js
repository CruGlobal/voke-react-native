import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import { navigateAction } from '../../actions/navigation';

import ConversationList from '../../components/ConversationList';
import StatusBar from '../../components/StatusBar';

const CONVERSATIONS = {
  id1: {
    id: 'id1',
    name: 'Asher',
    messages: [
      { id: '1', text: 'test 1 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '2', text: 'test 2 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '3', text: 'test 3 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '4', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
    ],
  },
  id2: {
    id: 'id2',
    name: 'Ben',
    messages: [
      { id: '1', text: 'test message 2 - 1' },
      { id: '2', text: 'test message 2 - 2' },
      { id: '3', text: 'test message 2 - 3' },
      { id: '4', text: 'test message 2 - 4' },
      { id: '5', text: 'test message 2 - 5' },
      { id: '6', text: 'test message 2 - 6' },
      { id: '7', text: 'test message 2 - 7' },
      { id: '8', text: 'test message 2 - 8' },
      { id: '9', text: 'test message 2 - 9' },
      { id: '10', text: 'test message 2 - 10' },
      { id: '11', text: 'test message 2 - 11' },
      { id: '12', text: 'test message 2 - 12' },
      { id: '13', text: 'test message 2 - 13' },
      { id: '14', text: 'test message 2 - 14' },
      { id: '15', text: 'test message 2 - 15' },
      { id: '16', text: 'test message 2 - 16' },
      { id: '17', text: 'test message 2 - 17' },
      { id: '18', text: 'test message 2 - 18' },
      { id: '19', text: 'test message 2 - 19' },
    ],
  },
};

class Home extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar />
        <ConversationList
          items={CONVERSATIONS}
          onSelect={(c) => dispatch(navigateAction('Message', c))}
          onRefresh={() => {}}
        />
      </View>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Home);