import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { Text, RefreshControl } from '../../components/common';
import { getOrgJourneys } from '../../actions/journeys';
import OrgJourney from '../../components/OrgJourney';

class AdventuresFind extends Component {
  state = { refreshing: true };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getOrgJourneys());
  }

  select = item => {
    console.log('select item', item);
  };

  renderRow = ({ item }) => {
    return <OrgJourney onPress={this.select} item={item} />;
  };

  render() {
    const { items } = this.props;
    const { refreshing } = this.state;
    return (
      <View style={styles.container}>
        <Text>Adventures Find!</Text>
        <FlatList
          initialNumToRender={4}
          data={items}
          renderItem={this.renderRow}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
            />
          }
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, journeys }) => ({
  me: auth.user,
  items: journeys.org,
});

export default translate()(connect(mapStateToProps)(AdventuresFind));
