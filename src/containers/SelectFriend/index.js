import React, { Component } from 'react';
import { Platform, View, Image, Share } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';

import { getContacts } from '../../actions/contacts';
import { openSettingsAction } from '../../actions/auth';
import { createConversation, getConversation, deleteConversation } from '../../actions/messages';
import Analytics from '../../utils/analytics';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';
import VOKE_BOT from '../../../images/voke_bot_face_large.png';

import ApiLoading from '../ApiLoading';
import { Flex, Text, Loading, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import Permissions from '../../utils/permissions';

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

    this.goToContacts = this.goToContacts.bind(this);
    this.selectContact = this.selectContact.bind(this);
    this.handleGetContacts = this.handleGetContacts.bind(this);
    this.handleDismissPermission = this.handleDismissPermission.bind(this);
    this.handleCheckPermission = this.handleCheckPermission.bind(this);
    this.checkContactsStatus = this.checkContactsStatus.bind(this);
    this.handleAllowContacts = this.handleAllowContacts.bind(this);
  }

  componentDidMount() {
    this.checkContactsStatus();
    Analytics.screen('Select a Friend');
  }

  goToContacts() {
    this.props.navigatePush('voke.Contacts', {
      onSelect: this.selectContact,
      video: this.props.video,
    });
  }

  handleGetContacts() {
    return this.props.dispatch(getContacts()).then(() => {
      this.setState({
        isLoading: false,
        random: getRandomContacts(this.props.all),
        permission: Permissions.AUTHORIZED,
      });
    }).catch(() => {
      this.setState({ isLoading: false, permission: Permissions.DENIED });
      LOG('contacts caught');
      //change screen
    });
  }

  handleDismissPermission() {
    this.setState({ isLoading: false });
    // permission not asked yet
  }

  handleCheckPermission(permission) {
    this.setState({ permission: permission });
    if (permission === Permissions.AUTHORIZED) {
      this.handleGetContacts();
    } else if (permission === Permissions.NOT_ASKED) {
      Navigation.showModal({
        screen: 'voke.Modal',
        animationType: 'fade',
        passProps: {
          getContacts: this.handleGetContacts,
          onDismiss: this.handleDismissPermission,
        },
        navigatorStyle: {
          screenBackgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        // Stop back button from closing modal https://github.com/wix/react-native-navigation/issues/250#issuecomment-254186394
        overrideBackPress: true,
      });
    } else {
      this.setState({ isLoading: false });
      // Change screen
    }
  }

  checkContactsStatus() {
    // On older android devices, don't even do the prompts
    if (Platform.OS === 'android' && Platform.Version < 23) {
      this.handleGetContacts();
    } else {
      Permissions.checkContacts().then(this.handleCheckPermission);
    }
  }

  handleAllowContacts() {
    if (Platform.OS === 'android') {
      this.handleGetContacts().then(() => {
        this.goToContacts();
      });
    } else if (this.state.permission === Permissions.DENIED) {
      // On iOS, open settings
      this.props.dispatch(openSettingsAction());
    } else {
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
    // let email = c.emailAddresses ? c.emailAddresses[0].email : null;

    let videoId = this.props.video;

    if (c.isVoke) {
      LOG('voke contact selected', this.props.video);
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
      this.props.dispatch(createConversation(data)).then((results) => {
        LOG('create voke conversation results', results);
        this.props.dispatch(getConversation(results.id)).then((c) => {
          LOG('get voke conversation results', c);
          this.props.navigatePush('voke.Message', {conversation: c.conversation, goBackHome: true});
        });
      });
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
      this.props.dispatch(createConversation(data)).then((results) => {
        LOG('create conversation results', results);
        const friend = results.messengers[0];

        Share.share(
          {
            message: `Hi ${friend ? friend.first_name : 'friend'}, check out this video ${friend ? friend.url : ''} `,
            title: 'Check this out',
          },
          {
            excludedActivityTypes: [
              'com.apple.UIKit.activity.PostToTwitter',
              'com.apple.uikit.activity.CopyToPasteboard',
              'com.google.Drive.ShareExtension',
              'com.apple.UIKit.activity.PostToFacebook',
              'com.apple.UIKit.activity.PostToFlickr',
              'com.apple.UIKit.activity.PostToVimeo',
              'com.apple.UIKit.activity.PostToWeibo',
              'com.apple.UIKit.activity.AirDrop',
              'com.apple.UIKit.activity.PostToSlack',
            ],
          }).then((results1) => {
          if (results1.action === 'sharedAction') {
            LOG('successfuly shared video');
            LOG('results.id', results.id);
            this.props.dispatch(getConversation(results.id)).then((c) => {
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
            this.state.permission === Permissions.AUTHORIZED ? (
              <Button
                onPress={this.goToContacts}
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
          this.state.permission !== Permissions.AUTHORIZED ? (
            <Button
              onPress={this.handleAllowContacts}
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
        {
          this.props.isLoading ? (
            <ApiLoading force={true} text={'Fetching your contacts,\ngive me a few seconds'} />
          ) : null
        }
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
  all: PropTypes.array.isRequired, // Redux
  isLoading: PropTypes.bool, // Redux
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  // voke: contacts.voke,
  isLoading: contacts.isLoading,
});

export default connect(mapStateToProps, nav)(SelectFriend);
