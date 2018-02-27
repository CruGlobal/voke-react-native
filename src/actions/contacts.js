import { Platform, Alert, Linking } from 'react-native';
import lodashMap from 'lodash/map';
import lodashFilter from 'lodash/filter';
import lodashChunk from 'lodash/chunk';
import DeviceInfo from 'react-native-device-info';
import { getPhoneCode, isValidNumber } from 'libphonenumber-js';

import { hashPhone } from '../utils/common';
import callApi, { REQUESTS } from './api';
import { setNoBackgroundAction } from './auth';
import CONSTANTS, { SET_ALL_CONTACTS, SET_VOKE_CONTACTS, SET_CONTACTS_LOADING } from '../constants';
import Permissions from '../utils/permissions';

export function setAllContacts(all) {
  return (dispatch) => {
    dispatch({ type: SET_ALL_CONTACTS, all });
  };
}

export function setVokeContacts(voke) {
  return (dispatch) => {
    dispatch({ type: SET_VOKE_CONTACTS, voke });
  };
}

function getFirstLetter(str) {
  if (!str) return '';
  let regExp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

  let newString = str.replace(regExp, '');
  return newString && newString[0] ? newString[0].toUpperCase() : '';
}

export function getContacts(force = false) {
  return (dispatch, getState) => (
    new Promise((resolve, reject) => {
      // On android, don't do any disconnecting/reconnecting in the background when getting permissions
      if (Platform.OS === 'android') {
        dispatch(setNoBackgroundAction(true));
      }

      // Keep track of when the contacts are loading and finished loading
      dispatch({ type: SET_CONTACTS_LOADING, isLoading: true });

      Permissions.checkContacts().then((permission) => {

        // On android, check the last updated time before requesting contacts
        if (permission === Permissions.AUTHORIZED && Platform.OS === 'android') {
          if (!force) {
            const lastUpdated = getState().contacts.lastUpdated;
            const now = new Date().valueOf();
            // LOG('lastUpdated', lastUpdated, now, now - lastUpdated, CONSTANTS.REFRESH_CONTACTS_TIME);

            if (lastUpdated && (now - lastUpdated < CONSTANTS.REFRESH_CONTACTS_TIME)) {
              // LOG('not updating contacts');
              dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
              resolve(true);
              return;
            }
          }
        }


        if (permission === Permissions.DENIED) {
          if (Platform.OS === 'ios') {
            Alert.alert(
              'Voke',
              'First grant Voke permission to access your contacts. Go to Settings / Voke and allow the permission for Contacts',
              [
                { text: 'Cancel', onPress: () => LOG('canceled') },
                { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
              ]
            );
          }
          LOG('contacts permission denied');
          dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
          reject();
          return;
        }

        const myNumber = getState().auth.user.mobile ? getState().auth.user.mobile : null;
        const myNumberCompare = (myNumber || '').replace(/[^0-9]/g, '').substring(-10);

        if (permission === Permissions.NOT_ASKED || permission === Permissions.AUTHORIZED) {
          Permissions.requestContacts().then((contacts) => {
            let all = contacts || [];
            if (Platform.OS === 'android') {
              // Sort by first name
              all = all.sort((a, b) => {
                const aName = (a.givenName || '').trim().toLowerCase();
                const bName = (b.givenName || '').trim().toLowerCase();
                if (aName < bName) return -1;
                else if (aName > bName) return 1;
                return 0;
              });
            } else {
              // Sort by last name
              all = all.sort((a, b) => {
                const aName = (a.familyName || '').trim().toLowerCase();
                const bName = (b.familyName || '').trim().toLowerCase();
                if (aName < bName) return -1;
                else if (aName > bName) return 1;
                return 0;
              });
            }


            all = lodashMap(all, (c) => {
              // Android doesn't have familyName, just givenName
              const name = `${c.givenName || ''} ${c.familyName || ''}`.trim();
              const firstNameLetter = getFirstLetter(c.givenName) || getFirstLetter(name);
              const lastNameLetter = getFirstLetter(c.familyName) || firstNameLetter;
              return {
                name,
                phone: lodashMap(c.phoneNumbers, 'number'),
                id: c.recordID,
                // Helper fields
                nameLower: name.toLowerCase(),
                lastNameLetter,
                firstNameLetter,
                initials: firstNameLetter + lastNameLetter,
              };
            });
            all = lodashFilter(all, (c) => c.phone.length > 0 && !!c.name && !c.phone.find((num) => (num || '').replace(/[^0-9]/g, '').substr(-10) === myNumberCompare));
            // LOG('all', all.length, all);



            if (!force) {
              const lastUpdated = getState().contacts.lastUpdated;
              const now = new Date().valueOf();
              if (lastUpdated && (now - lastUpdated < 24 * 60 * 60 * 1000)) {
                const currentContacts = getState().contacts.all || [];
                if (all.length === currentContacts.length ) {
                  dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
                  resolve(true);
                  return;
                }
              }
            }

            dispatch(setAllContacts(all));

            // API call to find out who matches voke
            dispatch(getVokeContacts(all))
              .then(() => {
                dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
                resolve(true);
              })
              .catch(() => {
                LOG('error getting voke contacts');
                dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
                reject();
              });
          }).catch((err) => {
            dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
            if (err === Permissions.DENIED) {
              Alert.alert('Could not get contacts', 'There was an error getting your contacts.');
            }
            LOG('permission denied for contacts', err);
            reject(Permissions.DENIED);
          });
        }
      }).catch(reject);
    })
  );
}


export function getVokeContacts(all) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      dispatch(uploadContacts(all)).then((vokeFriends) => {
        // Get just the contacts with the app
        const vokeFriendsWithApp = vokeFriends.filter((c) => c.mobile_app);
        console.log('voke friends with app', vokeFriendsWithApp);
        dispatch(setVokeContacts(vokeFriendsWithApp));
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
    })
  );
}

export function searchContacts(text) {
  return (dispatch, getState) => (
    new Promise((resolve) => {
      const contacts = getState().contacts.all || [];
      const searchTextLower = text.toLowerCase();
      const searchTextUpper = text.toUpperCase();
      const isOneLetter = text.length === 1;
      const results = contacts.filter((c) => {
        if (isOneLetter) {
          return c.lastNameLetter === searchTextUpper || c.firstNameLetter === searchTextUpper;
        }
        return c.nameLower.indexOf(searchTextLower) >= 0;
      });
      resolve(results);
    })
  );
}

export function uploadContacts(contacts = []) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      LOG('here');
      const countryCode = DeviceInfo.getDeviceCountry();
      const countryCodeNumber = '+' + getPhoneCode(countryCode);
      // Format every contact into a chunk for the API call
      let formattedContacts = contacts.map((c) => {
        let phone = c.phone[0];
        let testNum;
        if (countryCode && phone[0] !== '+') {
          if (countryCodeNumber.length > 1) {
            testNum = countryCodeNumber + phone;
          } else {
            testNum = '+1';
          }
          LOG(testNum, isValidNumber(testNum));
          if (isValidNumber(testNum)) {
            phone = testNum;
          }
        }
        return {
          mobile: hashPhone(phone),
          local_id: c.id,
        };
      });

      // Break up the contacts into chucnks of [X] number of contacts for each API call
      const contactChunks = lodashChunk(formattedContacts, CONSTANTS.CONTACT_CHUNKS);

      // Setup promises for the API calls for each chunk
      const promises = contactChunks.map((c) => {
        const data = { friends: c };
        return dispatch(callApi(REQUESTS.ADD_FRIENDS, {}, data));
      });

      // Make all the API calls at once
      Promise.all(promises).then((responses) => {
        // LOG('upload contacts responses', responses);
        let vokeContacts = [];
        responses.forEach((r) => {
          if (r && r.friends) {
            vokeContacts = vokeContacts.concat(r.friends || []);
          }
        });
        resolve(vokeContacts);
      }).catch((err) => {
        LOG('upload contacts error', err);
        reject(err);
      });
    })
  );
}
