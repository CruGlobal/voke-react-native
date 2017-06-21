import React from 'react';
import Button from '../../components/Button';
import { connect } from 'react-redux';

import { logoutAction } from '../../actions/auth';

function LogoutButton({ dispatch }) {
  return (
    <Button
      text="Logout"
      type="transparent"
      style={{ paddingRight: 10 }}
      onPress={() => dispatch(logoutAction())}
    />
  );
}

export default connect()(LogoutButton);
