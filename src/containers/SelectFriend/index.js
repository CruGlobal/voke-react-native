import React, { Component } from 'react';
import { Platform, View, Image, Share, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';

import { getContacts } from '../../actions/contacts';
import { openSettingsAction } from '../../actions/auth';
import { createConversation, getConversation, deleteConversation } from '../../actions/messages';
import Analytics from '../../utils/analytics';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, {DEFAULT} from '../../theme';
import VOKE_BOT from '../../../images/voke_bot_face_large.png';
import { vokeIcons } from '../../utils/iconMap';

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

const screenHeight = DEFAULT.FULL_HEIGHT;

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android handles back already
      icon: vokeIcons['back'], // For iOS only
    }],
  };
}

class SelectFriend extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
    tabBarHidden: true,
    statusBarHidden: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      setLoaderBeforePush: false,
      random: [],
      permission: '',
    };

    this.goToContacts = this.goToContacts.bind(this);
    this.selectContact = this.selectContact.bind(this);
    this.handleGetContacts = this.handleGetContacts.bind(this);
    this.handleDismissPermission = this.handleDismissPermission.bind(this);
    this.handleCheckPermission = this.handleCheckPermission.bind(this);
    this.checkContactsStatus = this.checkContactsStatus.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleAllowContacts = this.handleAllowContacts.bind(this);
  }

  componentDidMount() {
    // We need to check if we are coming from landscape in order to give the
    // transition enough time before the view locks from the modal
    if (this.props.isLandscape) {
      setTimeout(() => {
        this.checkContactsStatus();
      }, 1000);
    } else {
      this.checkContactsStatus();
    }
    Analytics.screen('Select a Friend');
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  goToContacts() {
    this.props.navigatePush('voke.Contacts', {
      onSelect: this.selectContact,
      video: this.props.video,
    });
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
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
        animationType: 'none',
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
      this.handleGetContacts();
    } else if (this.state.permission === Permissions.DENIED) {
      // On iOS, open settings
      this.props.dispatch(openSettingsAction());
    } else {
      this.checkContactsStatus();
    }
  }

  selectContact(c) {
    if (!c) return;
    // LOG(JSON.stringify(c));
    let phoneNumber = c.phone ? c.phone[0] : null;
    let name = c.name ? c.name.split(' ') : null;
    let firstName = name[0] ? name[0] : 'Friend';
    let lastName = name[name.length -1] ? name[name.length -1] : 'Buddy';
    // let email = c.emailAddresses ? c.emailAddresses[0].email : null;

    let videoId = this.props.video;

    if (c.isVoke) {
      // LOG('voke contact selected', this.props.video);
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
        // LOG('create voke conversation results', results);
        this.props.dispatch(getConversation(results.id)).then((c) => {
          // LOG('get voke conversation results', c);
          this.props.navigator.resetTo('voke.Message', {conversation: c.conversation, goBackHome: true});
        });
      });
    } else {
      // LOG('normal contact selected', this.props.video);
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
        Navigation.showModal({
          screen: 'voke.ShareModal',
          animationType: 'none',
          passProps: {
            onComplete: () => {
              LOG('onComplete');
              this.setState({ setLoaderBeforePush: true });
              Navigation.dismissModal({ animationType: 'none' });
              // On android, put a timeout because the share stuff gets messed up otherwise
              if (Platform.OS === 'android') {
                setTimeout(() => {
                  this.setState({ setLoaderBeforePush: false });
                  this.props.navigateResetTo('voke.Message', {
                    conversation: results,
                    goBackHome: true,
                    fetchConversation: true,
                  });
                }, 500);
              } else {
                this.setState({ setLoaderBeforePush: false });
                this.props.navigateResetTo('voke.Message', {
                  conversation: results,
                  goBackHome: true,
                  fetchConversation: true,
                });
              }
            },
            onCancel: () => {
              LOG('canceling');
              this.props.dispatch(deleteConversation(results.id));
              Navigation.dismissModal({ animationType: 'none' });
            },
            friend,
            phoneNumber,
          },
          // navigatorStyle: {
          //   screenBackgroundColor: 'rgba(0, 0, 0, 0.3)',
          // },
          overrideBackPress: true,
        });

        // Share.share(
        //   {
        //     message: `Hi ${friend ? friend.first_name : 'friend'}, check out this video ${friend ? friend.url : ''} `,
        //     title: 'Check this out',
        //   },
        //   {
        //     excludedActivityTypes: [
        //       'com.apple.UIKit.activity.PostToTwitter',
        //       'com.apple.uikit.activity.CopyToPasteboard',
        //       'com.google.Drive.ShareExtension',
        //       'com.apple.UIKit.activity.PostToFacebook',
        //       'com.apple.UIKit.activity.PostToFlickr',
        //       'com.apple.UIKit.activity.PostToVimeo',
        //       'com.apple.UIKit.activity.PostToWeibo',
        //       'com.apple.UIKit.activity.AirDrop',
        //       'com.apple.UIKit.activity.PostToSlack',
        //     ],
        //   }).then((results1) => {
        //   if (results1.action === 'sharedAction') {
        //     // LOG('successfully shared video, results.id', results.id);
        //     this.props.dispatch(getConversation(results.id)).then((c) => {
        //       LOG('getconversation results', c);
        //       this.props.navigatePush('voke.Message', {conversation: c.conversation, goBackHome: true});
        //     });
        //   } else {
        //     // LOG('Did Not Share Video');
        //     this.props.dispatch(deleteConversation(results.id));
        //   }
        // });
      });
    }
  }

  renderRandomContacts() {
    let randomHeight = {};
    if (screenHeight < 450) {
      randomHeight = {
        height: 30,
      };
    }
    return this.state.random.map((c, i) => (
      <Button
        key={`random_${i}`}
        onPress={() => this.selectContact(c)}
        text={c ? c.name : ' '}
        style={[styles.randomButton, randomHeight]}
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
    // if (this.state.setLoaderBeforePush)  {
    //   return (
    //     <Flex style={styles.container} justify="center" align="center" value={1}>
    //       <Loading />
    //     </Flex>
    //   );
    // }
    let randomHeight = {};
    const isAuthorized = this.state.permission === Permissions.AUTHORIZED;
    if (screenHeight < 450) {
      randomHeight = { height: 30 };
    }
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ alignSelf: 'stretch' }}>
        <StatusBar hidden={false} />
        <Flex align="center">
          <Flex justify="center" value={.8}>
            <Text style={styles.header}>
              Select a Friend
            </Text>
          </Flex>
          <Flex value={.5}>
            {
              isAuthorized ? (
                <Button
                  onPress={this.goToContacts}
                  text="Search Contacts"
                  style={[styles.randomButton, randomHeight]}
                  buttonTextStyle={styles.randomText}
                />
              ) : null
            }
          </Flex>
        </Flex>
        <Flex value={1} align="center" justify="center" style={styles.vokeBubbleImageWrap}>
          <Flex self="center" align="center" justify="center" value={1} style={styles.vokeBubble}>
            <Text style={styles.info}>
              {
                isAuthorized ? (
                  'Search your contacts or take a step of faith with...'
                ) : (
                  'It’s empty in here...\nYou need some contacts'
                )
              }
            </Text>
          </Flex>
          <Flex style={styles.imageWrap} align="end" justify="end" >
            <Image resizeMode="contain" source={VOKE_BOT} style={styles.vokeBot} />
          </Flex>
        </Flex>
        <Flex value={1} align="center">
          {
            !isAuthorized ? (
              <Button
                onPress={this.handleAllowContacts}
                text="Allow Contacts"
                style={[styles.randomButton, randomHeight]}
                buttonTextStyle={styles.randomText}
              />
            ) : null
          }
          <Flex justify="start" align="center" value={2}>
            { this.renderRandomContacts() }
          </Flex>
        </Flex>
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        {this.renderContent()}
        {
          this.props.isLoading || this.state.setLoaderBeforePush ? (
            <ApiLoading force={true} text={!this.state.setLoaderBeforePush ? 'Fetching your contacts,\ngive me a few seconds' : ''} />
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
  isLandscape: PropTypes.bool,
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  // voke: contacts.voke,
  isLoading: contacts.isLoading,
});

export default connect(mapStateToProps, nav)(SelectFriend);
