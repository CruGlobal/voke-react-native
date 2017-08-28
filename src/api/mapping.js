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
    return c;
  });
  // console.warn(JSON.stringify(conversations));
  return {
    conversations,
  };
}
