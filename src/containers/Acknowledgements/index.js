import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import Analytics from '../../utils/analytics';

import theme from '../../theme';
import SettingsList from '../../components/SettingsList';
import { vokeIcons } from '../../utils/iconMap';
import CONSTANTS from '../../constants';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: vokeIcons['back'], // for icon button, provide the local image asset name
    }],
  };
}

class Acknowledgements extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarBackgroundColor: theme.backgroundColor,
    navBarTextColor: theme.textColor,
    navBarButtonColor: theme.textColor,
  };

  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleLink = this.handleLink.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  componentDidMount() {
    Analytics.screen('Acknowledgements');
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
    }
  }

  render() {
    return (
      <SettingsList
        items={[
          {
            name: 'Crashlytics',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.CRASHLYTICS),
          },
          {
            name: 'React Native',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACTNATIVE),
          },
        ]}
      />
    );
  }
}

Acknowledgements.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Acknowledgements);
