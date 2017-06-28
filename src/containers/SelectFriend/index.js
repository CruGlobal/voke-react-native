import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';

import { Flex, Text, Loading, Button } from '../../components/common';

class SelectFriend extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
  };
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isLoading: false }), 500);
  }

  renderContent() {
    return (
      <Flex style={styles.container} direction="column" align="center" justify="center">
        <Flex justify="center" value={1}>
          <Text style={styles.header}>
            Select a Friend
          </Text>
        </Flex>
        <Flex align="center" value={.5}>
          <Text style={styles.info}>
            Vokebot found 3 friends in your contacts.
          </Text>
          <Text style={styles.info}>
            Select 1 to kickstart a deeper conversation.
          </Text>
        </Flex>
        <Flex justify="start" align="center" value={2}>
          <Flex style={styles.vokeBot}>
          </Flex>
          <Button
            onPress={() => {}}
            text="Ben G"
            style={styles.randomButton}
            buttonTextStyle={styles.randomText}
          />
          <Button
            onPress={() => {}}
            text="Bill Boy"
            style={styles.randomButton}
            buttonTextStyle={styles.randomText}
          />
          <Button
            onPress={() => {}}
            text="Susan Sucka"
            style={styles.randomButton}
            buttonTextStyle={styles.randomText}
          />
          <Flex direction="row" align="center" justify="center" style={styles.orSeparatorWrapper}>
            <Flex value={2} style={styles.orSeparator} />
            <Flex value={.5} align="center">
              <Text style={styles.orText}>OR</Text>
            </Flex>
            <Flex value={2} style={styles.orSeparator} />
          </Flex>
        </Flex>
        <Flex value={1.2}>
          <Button
            onPress={() => this.props.navigatePush('voke.Contacts')}
            text="Search Contacts"
            style={styles.randomButton}
            buttonTextStyle={styles.randomText}
          />
        </Flex>
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
