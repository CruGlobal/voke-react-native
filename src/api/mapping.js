import { momentUtc } from '../utils/common';

// Params for mapping are: (results, query, data, getState)
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
    _meta: results._meta,
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
  const myId = getState().auth.user.id;
  // Sort the messengers by putting the most recent messenger first
  const messengers = c.messengers.map((m) => {
    let latestTime;
    let latestMsgOrItem;

    // Set the latest time for each messenger from the most recent message
    if (m.latest_message && m.latest_message.created_at) {
      latestTime = m.latest_message.created_at;
      latestMsgOrItem = m.latest_message;
    }

    // If there is not a latestTime already set, set it with the item updated_at time
    if (!latestTime && m.latest_item && m.latest_item.updated_at) {
      latestTime = m.latest_item.updated_at;
      latestMsgOrItem = m.latest_item;
    }

    if (latestTime) {
      return { ...m, latestTime, latestMsgOrItem };
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
    const latestMsgOrItem = latestMessenger.latestMsgOrItem;
    if (latestMsgOrItem) {
      c.messagePreview = latestMsgOrItem.content || latestMsgOrItem.name || 'Shared a video';
      c.latestMessage = {
        message_id: latestMsgOrItem.message_id || latestMsgOrItem.id,
      };
    } else {
      c.messagePreview = null;
      c.latestMessage = {
        message_id: null,
      };
    }
  }

  const myMessage = messengers.find((e) => e.id === myId);
  c.myLatestReadId = myMessage && myMessage.latest_read && myMessage.latest_read.message_id;

  c.messengers = messengers;

  c.hasUnread = false;
  // if (c.messengers.length === 2) {
  //   c.hasUnread = false;
  //   c.unReadCount = 0;
  // } else if (myMessage && myMessage.latest_read && myMessage.latest_read.message_id) {
  //   if (myMessage.latest_read.message_id !== latestMessenger.latest_message.id) {
  //     c.hasUnread = true;
  //     c.unReadCount = 1;
  //   }
  // }
  // Check my message against the latest message sent
  if (myMessage && myMessage.latest_read && myMessage.latest_read.message_id) {
    if (myMessage.latest_read.message_id !== latestMessenger.latest_message.id) {
      c.hasUnread = true;
      c.unReadCount = 1;
    }
  }
  // This determines if the conversation has unread messages or not
  if (latestMessenger.id === myId) {
    c.hasUnread = false;
    c.unReadCount = 0;
  }

  // c.timeReceived = Date.now();

  return c;
}
