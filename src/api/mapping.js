import moment from 'moment';

// Params for mapping are: (results, query, data, getState)
export function mapAuth(results) {
  return {
    access_token: results.access_token,
    // conversation_id: results.conversation_id,
  };
}

export function mapMe(results) {
  return {
    user: results.user,
    // conversation_id: results.conversation_id,
  };
}

export function mapMessages(results) {
  let messages = results.messages || [];

  messages.sort(function(a, b) {
    if (a.created_at && !b.created_at) return -1;
    else if (b.created_at && !a.created_at) return 1;
    else if (!a.created_at && !b.created_at) return 0;

    let keyA = moment.utc(a.created_at, 'YYYY-MM-DD HH:mm:ss UTC').local();
    let keyB = moment.utc(b.created_at, 'YYYY-MM-DD HH:mm:ss UTC').local();

    // Compare the 2 dates
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });

  for (let i=0; i < messages.length -1; i++) {
    let currMessage = messages[i];
    let nextMessage = messages[i + 1];

    const currMessageTime = moment.utc(currMessage.created_at, 'YYYY-MM-DD HH:mm:ss UTC').local();
    const nextMessageTime = moment.utc(nextMessage.created_at, 'YYYY-MM-DD HH:mm:ss UTC').local();

    // console.warn(currMessageTime);
    // console.warn(nextMessageTime);
    const currMessageDate = currMessageTime.format('LL');
    const nextMessageDate = nextMessageTime.format('LL');

    if (currMessageDate !== nextMessageDate) {
      messages[i].isLatestForDay = true;
    } else {messages[i].isLatestForDay = false;}
  }

  messages[messages.length-1].isLatestForDay = true;

  return {
    messages,
  };
}

export function mapConversations(results) {
  let conversations = results.conversations || [];
  conversations = conversations.map((c) => {
    // Sort the messengers by putting the most recent messenger first
    c.messengers.sort(function(a, b) {
      if (a.latest_message && !b.latest_message) return -1;
      else if (b.latest_message && !a.latest_message) return 1;
      else if (!a.latest_message && !b.latest_message) return 0;

      // Pull out UTC dates using moment and telling it the format we're using
      let keyA = moment.utc(a.latest_message.created_at, 'YYYY-MM-DD HH:mm:ss UTC');
      let keyB = moment.utc(b.latest_message.created_at, 'YYYY-MM-DD HH:mm:ss UTC');
      // Compare the 2 dates
      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });
    // c.messengers[2] && c.messengers[2].latest_message && console.warn(c.id, JSON.stringify(c.messengers[2].latest_message.created_at),'should be sorted');

    // This adds the 'messagePreview' field as a text field onto each conversation
    const latestMessenger = c.messengers[0];
    if (latestMessenger) {
      let messagePreview = latestMessenger.latest_message ? latestMessenger.latest_message.content : null;
      if (!messagePreview) {
        messagePreview = latestMessenger.latest_item ? latestMessenger.latest_item.name : null;
      }
      c.messagePreview = messagePreview;
    }

    // This determines if the conversation has unread messages or not
    // if (latestMessenger.id === this.props.me.id) {
    //   c.hasUnread = false;
    // }
    //
    // let myMessage = c.messengers.find((e)=> {
    //   return e.id === this.props.me.id;
    // });
    //
    // if (myMessage && myMessage.latest_read && myMessage.latest_read.message_id) {
    //   if (myMessage.latest_read.message_id != latestMessenger.latest_message.id) {
    //     c.hasUnread = true;
    //   } else {
    //     c.hasUnread = false;
    //   }
    // } else {
    //   c.hasUnread = false;
    // }

    return c;
  });
  // console.warn(JSON.stringify(conversations));
  return {
    conversations,
  };
}
