import { Linking } from 'react-native';

export function send(phone, message) {
  return Linking.openURL(`sms:${phone}?body=${encodeURIComponent(message)}`);
}