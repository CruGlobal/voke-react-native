import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import { Flex, Text, Loading, Button } from '../../components/common';

class SelectFriend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contacts: [],
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isLoading: false }), 500);
  }

  renderContent() {
    return (
      <Flex direction="column">
        <Text style={styles.header}>
          Select a friend
        </Text>
        <Text style={styles.info}>
          Vokebot found 3 friends in your contacts.
        </Text>
        <Text style={styles.info}>
          Select 1 to kickstart a deeper conversation.
        </Text>
        <Button
          onPress={() => this.props.navigatePush('voke.Contacts')}
          text="Search Contacts"
        />
      </Flex>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? <Loading /> : this.renderContent()}
      </View>
    );
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
SelectFriend.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SelectFriend);
