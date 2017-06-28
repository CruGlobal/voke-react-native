import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';

import { Flex, Text, Loading, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';

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

    this.selectContact = this.selectContact.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isLoading: false }), 500);
  }

  selectContact(c) {
    if (c.isVoke) {
      console.warn('voke contact selected');
    } else {
      console.warn('normal contact selected');
    }
    // TODO: API call to create a link
    // const URL = 'https://my.vokeapp.com/CEHpHyo';
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
            onPress={() => this.selectContact({ name: 'Ben G'})}
            text="Ben G"
            style={styles.randomButton}
            buttonTextStyle={styles.randomText}
          />
          <Button
            onPress={() => this.selectContact({ name: 'Billy Boy'})}
            text="Bill Boy"
            style={styles.randomButton}
            buttonTextStyle={styles.randomText}
          />
          <Button
            onPress={() => this.selectContact({ name: 'Susan Sucka'})}
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
            onPress={() => this.props.navigatePush('voke.Contacts', {
              onSelect: this.selectContact,
            })}
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
        <StatusBar />
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
