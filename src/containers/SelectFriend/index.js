import React, { Component } from 'react';
import { View, Image, Share } from 'react-native';
import { connect } from 'react-redux';
import { getContacts } from '../../actions/contacts';
import { openSettingsAction } from '../../actions/auth';
import { createConversation, getConversation, deleteConversation } from '../../actions/messages';
import PropTypes from 'prop-types';
import Analytics from '../../utils/analytics';
import { Navigation } from 'react-native-navigation';
import Contacts from 'react-native-contacts';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';
import VOKE_BOT from '../../../images/voke_bot_face_large.png';

import { Flex, Text, Loading, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';

const NUM_RANDOM = 3;
function getRandomContacts(contacts) {
  const length = contacts.length;
  if (length < NUM_RANDOM) return contacts;
  let randomArray = [];
  for (let i = 0; i < NUM_RANDOM; i++) {
    let random;
    do {
      random = Math.floor(Math.random() * length);
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
    tabBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      random: [],
      permission: '',
    };

    this.selectContact = this.selectContact.bind(this);
    this.handleGetContacts = this.handleGetContacts.bind(this);
    this.handleDismissPermission = this.handleDismissPermission.bind(this);
    this.checkContactsStatus = this.checkContactsStatus.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
  }

  handleGetContacts() {
    this.props.dispatch(getContacts()).then(() => {
      this.setState({ isLoading: false, random: getRandomContacts(this.props.all), permission: 'authorized' });
    }).catch(()=> {
      this.setState({ isLoading: false });
      LOG('contacts caught');
      //change screen
    });
  }

  handleDismissPermission() {
    this.setState({ isLoading: false });
    // permission not asked yet
  }

  checkContactsStatus() {
    Contacts.checkPermission((err, permission)=>{
      this.setState({ permission: permission });
      if (permission === 'authorized') {
        this.handleGetContacts();
      } else if (permission === 'undefined') {
        Navigation.showModal({
          screen: 'voke.Modal', // unique ID registered with Navigation.registerScreen
          animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
          passProps: {
            getContacts: this.handleGetContacts,
            onDismiss: this.handleDismissPermission,
          },
          navigatorStyle: {
            screenBackgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        });
      } else {
        this.setState({ isLoading: false });
        // Change screen
      }
    });
  }

  componentDidMount() {
    LOG('get contacts dispatched');
    this.checkContactsStatus();
    Analytics.screen('Select a Friend');
  }

  handleSettings() {
    if (this.state.permission === 'denied') {
      this.props.dispatch(openSettingsAction());
    }
    else {
      this.checkContactsStatus();
    }
  }

  selectContact(c) {
    if (!c) return;
    LOG(JSON.stringify(c));
    let phoneNumber = c.phone ? c.phone[0] : null;
    let name = c.name ? c.name.split(' ') : null;
    let firstName = name[0] ? name[0] : 'Friend';
    let lastName = name[name.length -1] ? name[name.length -1] : 'Buddy';
    let email = c.emailAddresses ? c.emailAddresses[0].email : null;

    let videoId = this.props.video;

    if (c.isVoke) {
      LOG('voke contact selected', this.props.video);
    } else {
      LOG('normal contact selected', this.props.video);
      let data = {
        conversation: {
          messengers_attributes: [
            {
              first_name: `${firstName}`,
              last_name: `${lastName}`,
              mobile: `${phoneNumber}`,
            },
          ],
          item_id: `${videoId}`,
        },
      };
      this.props.dispatch(createConversation(data)).then((results)=>{
        LOG('create conversation results', results);
        const friend = results.messengers[0];

        Share.share({
          message: `Hi ${friend ? friend.first_name : 'friend'}, check out this video ${friend ? friend.url : ''} `,
          title: 'Check this out',
        }).then((results1)=> {
          if (results1.action === 'sharedAction') {
            LOG('successfuly shared video');
            LOG('results.id', results.id);
            this.props.dispatch(getConversation(results.id)).then((c)=> {
              LOG('getconversation results', c);
              this.props.navigatePush('voke.Message', {conversation: c.conversation, goBackHome: true});
            });
          } else {
            LOG('Did Not Share Video');
            this.props.dispatch(deleteConversation(results.id));
          }
        });
      });
    }
  }

  renderRandomContacts() {
    return this.state.random.map((c, i) => (
      <Button
        key={`random_${i}`}
        onPress={() => this.selectContact(c)}
        text={c ? c.name : ' '}
        style={styles.randomButton}
        buttonTextStyle={styles.randomText}
      />
    ));

    // let arr = [];
    // const isRandomSet = this.state.random.length > 0;
    // for (let i=0; i<NUM_RANDOM; i++) {
    //   const contact = isRandomSet ? this.state.random[i] || null : null;
    //   arr.push((
    //     <Button
    //       key={`random_${i}`}
    //       onPress={() => this.selectContact(contact)}
    //       text={contact ? contact.name : ' '}
    //       style={styles.randomButton}
    //       buttonTextStyle={styles.randomText}
    //     />
    //   ));
    // }
    // return arr;
  }

  renderContent() {
    if (this.state.isLoading)  {
      return (
        <Flex style={styles.container} justify="center" align="center" value={1}>
          <Loading />
        </Flex>
      );
    }
    return (
      <Flex style={styles.container} direction="column" align="center" justify="center">
        <StatusBar hidden={false} />
        <Flex justify="center" value={1}>
          <Text style={styles.header}>
            Select a Friend
          </Text>
        </Flex>
        <Flex value={.5}>
          {
            this.state.permission === 'authorized' ? (
              <Button
                onPress={() => this.props.navigatePush('voke.Contacts', {
                  onSelect: this.selectContact,
                  video: this.props.video,
                })}
                text="Search Contacts"
                style={styles.randomButton}
                buttonTextStyle={styles.randomText}
              />
            ) : null
          }
        </Flex>
        <Flex align="center" justify="center" value={.7} style={styles.vokeBubble}>
          <Text style={styles.info}>
            Search your contacts or take a step of faith with...
          </Text>
        </Flex>
        <Flex style={styles.imageWrap} value={.5} align="end" justify="end" >
          <Image resizeMode="contain" source={VOKE_BOT} style={styles.vokeBot} />
        </Flex>
        {
          this.state.permission != 'authorized' ? (
            <Button
              onPress={this.handleSettings}
              text="Allow Contacts"
              style={styles.randomButton}
              buttonTextStyle={styles.randomText}
            />
          ) : null
        }
        <Flex justify="start" align="center" value={2}>
          { this.renderRandomContacts() }
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

//OR SEPARATOR
// <Flex direction="row" align="center" justify="center" style={styles.orSeparatorWrapper}>
//   <Flex value={2} style={styles.orSeparator} />
//   <Flex value={.5} align="center">
//     <Text style={styles.orText}>OR</Text>
//   </Flex>
//   <Flex value={2} style={styles.orSeparator} />
// </Flex>

// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
SelectFriend.propTypes = {
  ...NavPropTypes,
  video: PropTypes.string.isRequired,
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  voke: contacts.voke,
});

export default connect(mapStateToProps, nav)(SelectFriend);
