import { momentUtc } from '../utils/common';

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

    let keyA = momentUtc(a.created_at).local();
    let keyB = momentUtc(b.created_at).local();

    // Compare the 2 dates
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });

  for (let i=0; i < messages.length - 1; i++) {
    let currMessage = messages[i];
    let nextMessage = messages[i + 1];

    const currMessageTime = momentUtc(currMessage.created_at).local();
    const nextMessageTime = momentUtc(nextMessage.created_at).local();

    // LOG(currMessageTime);
    // LOG(nextMessageTime);
    const currMessageDate = currMessageTime.format('LL');
    const nextMessageDate = nextMessageTime.format('LL');

    messages[i].isLatestForDay = currMessageDate !== nextMessageDate;
  }

  if (messages[messages.length - 1]) {
    messages[messages.length-1].isLatestForDay = true;
  }

  return {
    messages,
    _links: results._links,
  };
}

export function mapConversations(results, query, data, getState) {
  let conversations = results.conversations || [];
  conversations = conversations.map((c) => formatConversation(c, getState));
  // LOG(JSON.stringify(conversations));
  return {
    conversations,
    _links: results._links,
  };
}

export function mapConversation(results, query, data, getState) {
  let conversation = formatConversation(results, getState);
  // LOG('single conversation', JSON.stringify(conversation));
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
    // LOG('latest item', JSON.stringify(m.latest_item));
    if (m.latest_item && m.latest_item.updated_at) {
      if (!latestTime) {
        latestTime = m.latest_item.updated_at;
      } else {
        const keyA = momentUtc(latestTime);
        const mTime = momentUtc(m.latest_item.updated_at);
        if (mTime > keyA) {
          latestTime = m.latest_item.updated_at;
        } else {
          // LOG('message is before time', latestTime, m.latest_item.updated_at);
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
    const keyA = momentUtc(a.latestTime);
    const keyB = momentUtc(b.latestTime);
    // Compare the 2 dates
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });
  // c.messengers[2] && c.messengers[2].latest_message && LOG(c.id, JSON.stringify(c.messengers[2].latest_message.created_at),'should be sorted');

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

  const myMessage = messengers.find((e) => e.id === getState().auth.user.id);

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

  // c.timeReceived = Date.now();

  return c;
}
