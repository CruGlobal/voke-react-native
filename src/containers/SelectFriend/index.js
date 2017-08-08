import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { getContacts } from '../../actions/contacts';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';

import { Flex, Text, Loading, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';

const NUM_RANDOM = 3;
function getRandom(contacts) {
  const length = contacts.length;
  if (length < NUM_RANDOM) return contacts;
  let randomArray = [];
  for (let i = 0; i < NUM_RANDOM; i++) {
    let random;
    do {
      random = Math.floor( Math.random() * length);
    } while (randomArray.indexOf(random) != -1);
    randomArray.push(random);
  }
  return [
    contacts[randomArray[0]],
    contacts[randomArray[1]],
    contacts[randomArray[2]],
  ];
}

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
      random: [],
    };

    this.selectContact = this.selectContact.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isLoading: false }), 500);
    if (this.props.all && this.props.all.length > 0) {
      this.setState({ random: getRandom(this.props.all) });
    } else {
      console.warn('dispatched');
      this.props.dispatch(getContacts()).then(() => {
        this.setState({ random: getRandom(this.props.all) });
      }).catch(()=> {console.warn('caught');});
    }
  }

  selectContact(c) {
    if (!c) return;
    if (c.isVoke) {
      console.warn('voke contact selected');
    } else {
      console.warn('normal contact selected');
    }
    // TODO: API call to create a link
    // const URL = 'https://my.vokeapp.com/CEHpHyo';
  }

  renderRandomContacts() {
    let arr = [];
    const isRandomSet = this.state.random.length > 0;
    for (let i=0; i<NUM_RANDOM; i++) {
      const contact = isRandomSet ? this.state.random[i] || null : null;
      arr.push((
        <Button
          key={`random_${i}`}
          onPress={() => this.selectContact(contact)}
          text={contact ? contact.name : ' '}
          style={styles.randomButton}
          buttonTextStyle={styles.randomText}
        />
      ));
    }
    return arr;
  }

  renderContent() {
    if (this.state.isLoading)  {
      return (
        <Flex justify="center" value={1}>
          <Loading />
        </Flex>
      );
    }
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
          { this.renderRandomContacts() }
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
        {this.renderContent()}
      </View>
    );
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
SelectFriend.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  voke: contacts.voke,
});

export default connect(mapStateToProps, nav)(SelectFriend);
