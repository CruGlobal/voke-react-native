import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import { getContacts } from '../../actions/contacts';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import ContactsList from '../../components/ContactsList';

class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }
  componentDidMount() {
    // Make sure the transition is complete before loading the contacts
    setTimeout(() => {
      this.props.dispatch(getContacts()).then(() => {
        this.setState({ isLoading: false });
      });
    }, 1000);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <ContactsList
          items={this.props.all}
          onSelect={(contact) => {
            console.warn('selected', contact);
          }}
        />
      </View>
    );
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Contacts.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  voke: contacts.voke,
});

export default connect(mapStateToProps, nav)(Contacts);
