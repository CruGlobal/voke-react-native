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

  if (messages[messages.length-1]) {
    messages[messages.length-1].isLatestForDay = true;
  }

  return {
    messages,
  };
}

export function mapConversations(results, query, data, getState) {
  let conversations = results.conversations || [];
  conversations = conversations.map((c) => {
    c = formatConversation(c, getState);
    return c;
  });
  // console.warn(JSON.stringify(conversations));
  return {
    conversations,
  };
}

export function mapConversation(results, query, data, getState) {
  let conversation = formatConversation(results, getState);
  console.warn('single conversation', JSON.stringify(conversation));
  return {
    conversation,
  };
}


function formatConversation(c, getState) {
  // Sort the messengers by putting the most recent messenger first
  const messengers = c.messengers.map((m) => {
    let latestTime;

    if (m.latest_message && m.latest_message.created_at) {
      latestTime = m.latest_message.created_at;
    }
    console.warn('latest item', JSON.stringify(m.latest_item));
    if (m.latest_item && m.latest_item.updated_at) {
      if (!latestTime) {
        latestTime = m.latest_item.updated_at;
      } else {
        let keyA = moment.utc(latestTime, 'YYYY-MM-DD HH:mm:ss UTC');
        let mTime = moment.utc(m.latest_item.updated_at, 'YYYY-MM-DD HH:mm:ss UTC');
        if (mTime > keyA) {
          latestTime = m.latest_item.updated_at;
        } else {
          console.warn('message is before time', latestTime, m.latest_item.updated_at);
        }
      }
    }
    if (latestTime) {
      return { ...m, latestTime };
    }
    return m;
  });
  messengers.sort(function(a, b) {
    if (a.latestTime && !b.latestTime) return -1;
    else if (b.latestTime && !a.latestTime) return 1;
    else if (!a.latestTime && !b.latestTime) return 0;

    // Pull out UTC dates using moment and telling it the format we're using
    let keyA = moment.utc(a.latestTime, 'YYYY-MM-DD HH:mm:ss UTC');
    let keyB = moment.utc(b.latestTime, 'YYYY-MM-DD HH:mm:ss UTC');
    // Compare the 2 dates
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });
  // c.messengers[2] && c.messengers[2].latest_message && console.warn(c.id, JSON.stringify(c.messengers[2].latest_message.created_at),'should be sorted');

  // This adds the 'messagePreview' field as a text field onto each conversation
  const latestMessenger = messengers[0];
  if (latestMessenger) {
    let messagePreview = latestMessenger.latest_message ? latestMessenger.latest_message.content : null;
    if (latestMessenger.latest_message && !latestMessenger.latest_message.content) {
      messagePreview = 'Shared a video';
    }
    // if (!messagePreview) {
    //   messagePreview = latestMessenger.latest_item ? latestMessenger.latest_item.name : null;
    // }
    c.messagePreview = messagePreview;
  }
  // if (latestMessenger && latestMessenger.latestItem) {
  //   c.messagePreview = latestMessenger.latestItem.preview;
  // }

  let myMessage = messengers.find((e) => {
    return e.id === getState().auth.user.id;
  });

  c.messengers = messengers;

  if (myMessage && myMessage.latest_read && myMessage.latest_read.message_id) {
    if (myMessage.latest_read.message_id != latestMessenger.latest_message.id) {
      c.hasUnread = true;
    } else {
      c.hasUnread = false;
    }
  } else {
    c.hasUnread = false;
  }

  // This determines if the conversation has unread messages or not
  if (latestMessenger.id === getState().auth.user.id) {
    c.hasUnread = false;
  }

  return c;
}
