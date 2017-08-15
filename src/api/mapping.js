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
