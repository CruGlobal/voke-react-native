import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navMenuOptions } from '../../utils/menu';
import PopupMenu from '../../components/PopupMenu';

// Android uses this popup menu
class MenuButton extends Component {
  render() {
    return <PopupMenu actions={navMenuOptions(this.props.dispatch)} />;
  }
}

export default connect()(MenuButton);
