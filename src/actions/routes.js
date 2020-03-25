import CONSTANTS from '../constants';

const CLIENT = {
  id: CONSTANTS.CLIENT_ID,
  secret: CONSTANTS.CLIENT_SECRET,
};

const ROUTES = {
  LOGIN: {
    method: 'post',
    url: 'oauth/token',
    anonymous: true,
    isAuth: true,
    customData: {
      client: CLIENT,
      grant_type: 'password',
      scope: 'messenger',
    },
  },
  CREATE_ACCOUNT: {
    method: 'post',
    url: 'me',
    anonymous: true,
    customData: {
      client: CLIENT,
    },
  },
  UPDATE_ME: {
    method: 'put',
    url: 'me',
  },
  GET_ME: {
    method: 'get',
    url: 'me',
  },
  GET_AVAILABLE_ADVENTURES: { method: 'get', url: `organization_journeys` },
  GET_MY_ADVENTURES: { method: 'get', url: `me/journeys` },
  START_ADVENTURE: { method: 'post', url: `me/journeys` },
  GET_ADVENTURE_INVITATIONS: { method: 'get', url: `me/journey_invites` },
  SEND_ADVENTURE_INVITATION: { method: 'post', url: `me/journey_invites` },
  RESEND_ADVENTURE_INVITATION: {
    method: 'put',
    url: `me/journey_invites/:inviteId/resend`,
  },
  DELETE_ADVENTURE_INVITATION: {
    method: 'delete',
    url: `me/journey_invites/:inviteId`,
  },
  ACCEPT_ADVENTURE_INVITATION: {
    method: 'post',
    url: `me/journey_invites/accept`,
  },
  ARTISTS_GET: { method: 'get', url: `artists` },
  ARTISTS_ID_GET: { method: 'get', url: `artists/{artistId}` },
  FEATURED_ALBUMS_GET: { method: 'get', url: `featured/albums` },
  FEATURED_ARTISTS_GET: { method: 'get', url: `featured/artists` },
  FEATURED_PLAYLISTS_GET: { method: 'get', url: `featured/playlists` },
  LIBRARY_ALBUMS_GET: { method: 'get', url: `library/albums` },
  LIBRARY_ARTISTS_GET: { method: 'get', url: `library/artists` },
  LIBRARY_PLAYLISTS_GET: { method: 'get', url: `library/playlists` },
  LIBRARY_TRACKS_GET: { method: 'get', url: `library/tracks` },
  PLAYLISTS_GET: { method: 'get', url: `playlists` },
  PLAYLISTS_ID_GET: { method: 'get', url: `playlists/{playlistId}` },
  SEARCH_GET: { method: 'get', url: `search` },
  SEARCH_POST: { method: 'post', url: `search` },
  SEARCH_TAG_POST: { method: 'post', url: `search/tags` },
  TAGS_GET: { method: 'get', url: `tags` },
  TRACKS_GET: { method: 'get', url: `tracks` },
  USERS_ACCOUNT_GET: { method: 'get', url: `users/account` },
  USERS_ACCOUNT_ID_PUT: { method: 'put', url: `users/account/{userID}` },
  USERS_ACCOUNT_POST: { method: 'post', url: `users/account` },
  USERS_FAVORITE_ALBUMS_DELETE: {
    method: 'delete',
    url: `users/favorite/albums`,
  },
  USERS_FAVORITE_ALBUMS_GET: { method: 'get', url: `users/favorite/albums` },
  USERS_FAVORITE_ALBUMS_POST: { method: 'post', url: `users/favorite/albums` },
  USERS_FAVORITE_ARTISTS_DELETE: {
    method: 'delete',
    url: `users/favorite/artists`,
  },
  USERS_FAVORITE_ARTISTS_GET: { method: 'get', url: `users/favorite/artists` },
  USERS_FAVORITE_ARTISTS_POST: {
    method: 'post',
    url: `users/favorite/artists`,
  },
  USERS_FAVORITE_PLAYLISTS_DELETE: {
    method: 'delete',
    url: `users/favorite/playlists`,
  },
  USERS_FAVORITE_PLAYLISTS_GET: {
    method: 'get',
    url: `users/favorite/playlists`,
  },
  USERS_FAVORITE_PLAYLISTS_POST: {
    method: 'post',
    url: `users/favorite/playlists`,
  },
  USERS_FAVORITE_TRACKS_DELETE: {
    method: 'delete',
    url: `users/favorite/tracks`,
  },
  USERS_FAVORITE_TRACKS_GET: { method: 'get', url: `users/favorite/tracks` },
  USERS_FAVORITE_TRACKS_POST: { method: 'post', url: `users/favorite/tracks` },
  USERS_PLAYLIST__IDPUT: { method: 'put', url: `users/playlists/{playlistId}` },
  USERS_PLAYLIST_GET: { method: 'get', url: `users/playlists` },
  USERS_PLAYLIST_ID_DELETE: {
    method: 'delete',
    url: `users/playlists/{playlistId}`,
  },
  USERS_PLAYLIST_ID_GET: { method: 'get', url: `users/playlists/{playlistId}` },
  USERS_PLAYLIST_ID_TRACKS_ID_DELETE: {
    method: 'delete',
    url: `users/playlists/{playlistId}/tracks/{trackId}`,
  },
  USERS_PLAYLIST_ID_TRACKS_POST: {
    method: 'post',
    url: `users/playlists/{playlistId}/tracks`,
  },
  USERS_PLAYLIST_POST: { method: 'post', url: `users/playlists` },
  USERS_PLAYLIST_TRACKS_ID_GET: {
    method: 'get',
    url: `users/playlists/tracks/{trackId}`,
  },
  VIDEOS_GET: { method: 'get', url: `videos` },
};

export default ROUTES;
