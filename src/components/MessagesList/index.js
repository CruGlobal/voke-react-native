
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Keyboard, Platform } from 'react-native';

import CONSTANTS from '../../constants';
import styles from './styles';
import MessageItem from '../MessageItem';
import LoadMore from '../../components/LoadMore';
import {Flex} from '../../components/common';


class MessagesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      componentHeight: 0,
      messagesHeight: 0,
      // topHeight: 0,
      scrollEnabled: true,
    };

    this.renderLoadMore = this.renderLoadMore.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.scrollEnd = this.scrollEnd.bind(this);
    this.renderTypeState = this.renderTypeState.bind(this);
    this.onLayoutEvent = this.onLayoutEvent.bind(this);
    this.onContentSize = this.onContentSize.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.updateSizes = this.updateSizes.bind(this);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow() {
    // alert('Keyboard Shown');
    // this.setState({ scrollEnabled: true });
  }

  keyboardDidHide() {
    // alert('Keyboard Hidden');
    // let height = this.state.messagesHeight;
    // let componentHeight = this.state.componentHeight;
    // if (componentHeight - height < 0) {
    //   this.setState({ topHeight: 0});
    // } else {
    //   this.setState({ topHeight: componentHeight - height});
    // }
    this.updateSizes();
  }

  renderLoadMore() {
    if (this.props.hasMore) {
      return <LoadMore onLoad={this.props.onLoadMore} />;
    }
    return null;
  }

  onLayoutEvent(event) {
    // LOG(event.nativeEvent.layout.x);
    // LOG(event.nativeEvent.layout.y);
    // LOG(event.nativeEvent.layout.width);
    // LOG(event.nativeEvent.layout.height);
    // flexView.measure((ox)=> this.setState({ componentHeight: ox }));
    this.setState({componentHeight: event.nativeEvent.layout.height});
    this.updateSizes();
  }

  updateSizes() {
    if (this.state.messagesHeight != 0 && this.state.componentHeight !=0 ) {
    //   if (this.state.componentHeight - this.state.messagesHeight > 0) {
    //     this.setState({ topHeight: this.state.componentHeight - this.state.messagesHeight});
    //   } else {
    //     this.setState({ topHeight: 0 });
    //   }
    // } else {
    //   this.setState({ topHeight: 0});
    // }
      if (this.state.messagesHeight < this.state.componentHeight) {
        // this.setState({ scrollEnabled: false });
      } else {
        // this.setState({ scrollEnabled: true});
      }
    }
  }

  onContentSize(contentWidth, contentHeight) {
    // LOG("<<<<<< content >>>>>>>>>", contentWidth, contentHeight);
    this.setState({ messagesHeight: contentHeight});
    this.updateSizes();
  }

  renderRow({ item }) {
    return (
      <Flex value={1} style={{ transform: [{ scaleY: -1 }]}}>
        <MessageItem
          item={item}
          user={this.props.user}
          messengers={this.props.messengers}
          onSelectVideo={() => this.props.onSelectVideo(item)}
        />
      </Flex>
    );
  }

  renderTypeState() {
    const { items, typeState, user, messengers, onSelectVideo } = this.props;
    // if (items.length < 4) {
    //   if (typeState) {
    //     const item = { type: 'typeState' };
    //     return (
    //       <View style={{ transform: [{ scaleY: -1 }], zIndex: 100}}>
    //         <MessageItem
    //           item={item}
    //           user={user}
    //           messengers={messengers}
    //           onSelectVideo={() => onSelectVideo(item)}
    //         />
    //         <Flex value={1} style={{flex: 1}}></Flex>
    //       </View>
    //     );
    //   } else {
    //     return (
    //       <Flex value={100} style={{backgroundColor: 'black', paddingBottom: 100}}></Flex>
    //     );
    //   }
    // }
    if (typeState) {
      const item = { type: 'typeState' };
      return (
        <View style={{ transform: [{ scaleY: -1 }], zIndex: 100}}>
          <MessageItem
            item={item}
            user={user}
            messengers={messengers}
            onSelectVideo={() => onSelectVideo(item)}
          />
        </View>
      );
    } else return null;
  }

  scrollEnd() {
  // scrollEnd(isAnimated) {
  //   // Somehow check if the listview is in the middle
  //   if (this.listView) {
  //     setTimeout(() => this.listView.scrollToEnd({ animated: isAnimated }), 50);
  //   }
  //   setTimeout(() => {
  //     this.listView.scrollToEnd({ animated: isAnimated });
  //   }, Platform.OS === 'ios' ? 50 : 250);
  }

  render() {
    return (
      <FlatList
        ref={(c) => this.listView = c}
        ListFooterComponent={this.renderLoadMore}
        keyExtractor={(item) => item.id}
        style={{ transform: [{ scaleY: -1 }]}}
        initialNumToRender={CONSTANTS.PAGE_SIZE + 1}
        data={this.props.items}
        renderItem={this.renderRow}
        contentContainerStyle={styles.content}
        inverted={true}
        removeClippedSubviews={Platform.OS === 'ios' ? false : undefined}
        ListHeaderComponent={this.renderTypeState}
        scrollEnabled={Platform.OS === 'android' ? true : this.state.scrollEnabled}
      />
    );
    // onContentSizeChange={this.onContentSize}
    // onLayout={this.onLayoutEvent}
  }
}

MessagesList.propTypes = {
  items: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  messengers: PropTypes.array.isRequired,
  onSelectVideo: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  onLoadMore: PropTypes.func,
  typeState: PropTypes.bool,
  onEndReached: PropTypes.func.isRequired,
};

export default MessagesList;
