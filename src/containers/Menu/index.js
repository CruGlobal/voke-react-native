import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import { navMenuOptions } from '../../utils/menu';
import nav, { NavPropTypes } from '../../actions/nav';
import SettingsList from '../../components/SettingsList';
import { Button } from '../../components/common';
import Header from '../Header';

class Menu extends Component {
  componentDidMount() {
    Analytics.screen('Menu');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          right={
            <Button
              type="transparent"
              text="Done"
              buttonTextStyle={{ padding: 10, fontSize: 16 }}
              onPress={() => this.props.navigateBack()}
            />
          }
          title="Settings"
          light={true}
        />
        <SettingsList items={navMenuOptions(this.props)} />
      </View>
    );
  }
}

Menu.propTypes = {
  ...NavPropTypes,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isAnonUser: auth.isAnonUser,
});

export default translate()(
  connect(
    mapStateToProps,
    nav,
  )(Menu),
);
