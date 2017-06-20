import React from 'react';
import { Button } from 'react-native';
import { connect } from 'react-redux';

import { logoutAction } from '../../actions/auth';

function LogoutButton({ dispatch }) {
  return (
    <Button
      title="Logout"
      onPress={() => dispatch(logoutAction())}
    />
  );
}

export default connect()(LogoutButton);