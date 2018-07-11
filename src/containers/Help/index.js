import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import { connect } from 'react-redux';
import Communications from 'react-native-communications';
import { translate } from 'react-i18next';

import nav, { NavPropTypes } from '../../actions/nav';
import Analytics from '../../utils/analytics';
import SettingsList from '../../components/SettingsList';
import Button from '../../components/Button';
import CONSTANTS from '../../constants';
import Header from '../Header';
import theme from '../../theme';

const EMAIL = ['support@vokeapp.com'];
const REPORT_TITLE = 'I would like to report a user';
const EMAIL_US_TITLE = 'Email to Voke Support';
const FEATURE_REQUEST_TITLE = 'Feature Request for Voke';

class Help extends Component {
  constructor(props) {
    super(props);
    this.handleLink = this.handleLink.bind(this);
    this.handleShare = this.handleShare.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Contacts');
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
    Communications.email(EMAIL, null, null, title, null);
  }

  render() {
    const { t, navigateBack } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          right={
            theme.isAndroid ? (
              undefined
            ) : (
              <Button
                type="transparent"
                text={t('done')}
                buttonTextStyle={{ padding: 10, fontSize: 16 }}
                onPress={() => {
                  // Close out of the settings by going back 2 times
                  navigateBack();
                  navigateBack();
                }}
              />
            )
          }
          leftBack={true}
          title={t('title.help')}
          light={true}
        />
        <SettingsList
          items={[
            {
              name: t('visitWebsite'),
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.HELP),
            },
            {
              name: t('visitFAQ'),
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.FAQ),
            },
            {
              name: t('featureRequest'),
              onPress: () => this.handleShare('feature'),
            },
            {
              name: t('report'),
              onPress: () => this.handleShare('report'),
            },
            {
              name: t('email'),
              onPress: () => this.handleShare('emailUs'),
            },
          ]}
        />
      </View>
    );
  }
}

Help.propTypes = {
  ...NavPropTypes,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('settings')(
  connect(
    mapStateToProps,
    nav,
  )(Help),
);
