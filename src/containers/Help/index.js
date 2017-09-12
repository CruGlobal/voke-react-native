import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Navigation } from 'react-native-navigation';
import Communications from 'react-native-communications';

import theme from '../../theme';
import { vokeIcons } from '../../utils/iconMap';
import SettingsList from '../../components/SettingsList';

const EMAIL = ['support@vokeapp.com'];
const REPORT_TITLE = 'I would like to report a user';
const EMAIL_US_TITLE = 'Email to Voke Support';
const FEATURE_REQUEST_TITLE = 'Feature Request for Voke';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: vokeIcons['back'], // for icon button, provide the local image asset name
    }],
    rightButtons: [{
      title: 'Done',
      id: 'done',
      disableIconTint: true,
    }],
  };
}

class Help extends Component {

  static navigatorStyle = {
    navBarBackgroundColor: theme.backgroundColor,
    navBarTextColor: theme.textColor,
    navBarButtonColor: theme.textColor,
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleLink = this.handleLink.bind(this);
    this.handleShare = this.handleShare.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
      if (event.id =='done') {
        Navigation.dismissModal({
          animationType: 'slide-down',
        });
      }
    }
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  handleShare(c) {
    let title;
    if (c === 'feature') {
      title = FEATURE_REQUEST_TITLE;
    } else if (c === 'report') {
      title = REPORT_TITLE;
    } else {
      title = EMAIL_US_TITLE;
    }
    Communications.email(EMAIL,null,null,title,null);
  }

  render() {
    return (
      <SettingsList
        items={[
          {
            name: 'Visit our Help Website',
            onPress: () => this.handleLink('https://help.vokeapp.com/'),
          },
          {
            name: 'Visit our FAQ Website',
            onPress: () => this.handleLink('https://www.vokeapp.com/faq'),
          },
          {
            name: 'Make a Feature Request',
            onPress: () => this.handleShare('feature'),
          },
          {
            name: 'Report a User',
            onPress: () => this.handleShare('report'),
          },
          {
            name: 'Email Us',
            onPress: () => this.handleShare('emailUs'),
          },
        ]}
      />
    );
  }
}

Help.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Help);
